/**
 * Cloudflare Worker for the site.
 *
 * Only /api/* reaches this code (see run_worker_first in wrangler.jsonc);
 * every page and asset is still served straight from the static build.
 *
 * POST /api/brief — the dataset brief form (src/pages/brief.astro). It checks
 * the submission and emails it to the BSG mailbox through the Zoho Mail API.
 *
 * Privacy: nothing is stored here. The brief is held in memory for the length
 * of the request, sent to Zoho (which already hosts the mailbox), and dropped.
 * Do not add logging of field values — only statuses are logged.
 */

interface WorkerEnv {
  ASSETS: Fetcher;

  /** Where briefs are sent from and to. Set in wrangler.jsonc. */
  BRIEF_TO: string;
  BRIEF_FROM: string;
  /** Zoho data-centre hosts: zohocloud.ca for the Canadian data centre. */
  ZOHO_ACCOUNTS_HOST: string;
  ZOHO_MAIL_HOST: string;

  /** Secrets — set with `npx wrangler secret put <NAME>`. */
  ZOHO_CLIENT_ID?: string;
  ZOHO_CLIENT_SECRET?: string;
  ZOHO_REFRESH_TOKEN?: string;
  ZOHO_ACCOUNT_ID?: string;
}

/** The fields the form sends, with the label each gets in the email. */
const FIELDS = [
  { name: 'name', label: 'Name', required: true, max: 120 },
  { name: 'email', label: 'Work email', required: true, max: 200 },
  { name: 'organisation', label: 'Organisation', required: true, max: 200 },
  { name: 'use', label: 'Dataset type and intended model use', required: true, max: 2000 },
  { name: 'languages', label: 'Languages, markets, or participant profile', required: false, max: 2000 },
  { name: 'volume', label: 'Target volume and preferred format', required: false, max: 1000 },
  { name: 'timeline', label: 'Desired delivery timeline', required: false, max: 500 },
  { name: 'governance', label: 'Rights, governance, or compliance requirements', required: false, max: 2000 },
  { name: 'budget', label: 'Approximate pilot budget or licensing range', required: false, max: 60 },
] as const;

const BUDGETS = new Set(['', 'Under US$5k', 'US$5k–50k', 'US$50k+', 'Not sure yet']);

/** Submissions faster than this after the page loaded are treated as bots. */
const MIN_FILL_MS = 3000;

type Brief = Record<(typeof FIELDS)[number]['name'], string>;

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/brief') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
      return handleBrief(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<WorkerEnv>;

async function handleBrief(request: Request, env: WorkerEnv, url: URL): Promise<Response> {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const reply = (status: number, code: string) =>
    wantsJson
      ? Response.json({ ok: status < 400, code }, { status })
      : // No JavaScript: send the browser to the confirmation page, or back to
        // the form with a code the page turns into a message.
        Response.redirect(new URL(status < 400 ? '/brief/sent' : `/brief?error=${code}`, url).href, 303);

  // Only accept posts from this site's own pages.
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) return reply(403, 'origin');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, 'invalid');
  }

  // Bots: the hidden field must stay empty, and the form must not be filled
  // in instantly. `started` is stamped by the page's script, so it is absent
  // for visitors without JavaScript; they are checked by the hidden field only.
  // A bot that fills the hidden field is told it succeeded, so it moves on.
  const started = Number(form.get('started'));
  if (form.get('website')) return reply(200, 'sent');
  if (started && Date.now() - started < MIN_FILL_MS) return reply(400, 'too-fast');

  const brief = {} as Brief;
  for (const field of FIELDS) {
    const value = String(form.get(field.name) ?? '').trim();
    if (field.required && !value) return reply(400, 'missing');
    if (value.length > field.max) return reply(400, 'too-long');
    brief[field.name] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email)) return reply(400, 'email');
  if (!BUDGETS.has(brief.budget)) return reply(400, 'invalid');

  if (!env.ZOHO_CLIENT_ID || !env.ZOHO_CLIENT_SECRET || !env.ZOHO_REFRESH_TOKEN || !env.ZOHO_ACCOUNT_ID) {
    console.error('brief: Zoho secrets not set');
    return reply(503, 'unavailable');
  }

  try {
    await sendBrief(env, brief);
  } catch (error) {
    console.error('brief: send failed', error instanceof Error ? error.message : 'unknown');
    return reply(502, 'unavailable');
  }

  return reply(200, 'sent');
}

// ── Zoho Mail ─────────────────────────────────────────────────────────────

let cachedToken: { value: string; expires: number } | null = null;

/** Trades the long-lived refresh token for a one-hour access token. */
async function accessToken(env: WorkerEnv): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value;

  const response = await fetch(`https://${env.ZOHO_ACCOUNTS_HOST}/oauth/v2/token`, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env.ZOHO_CLIENT_ID!,
      client_secret: env.ZOHO_CLIENT_SECRET!,
      refresh_token: env.ZOHO_REFRESH_TOKEN!,
    }),
  });
  const data = (await response.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!response.ok || !data.access_token) throw new Error(`token ${response.status} ${data.error ?? ''}`);

  cachedToken = { value: data.access_token, expires: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

async function sendBrief(env: WorkerEnv, brief: Brief): Promise<void> {
  const lines = FIELDS.map((field) => `${field.label}:\n${brief[field.name] || '—'}`);
  const content = [
    'New enquiry from bsgdataworks.com/brief.',
    `Reply to: ${brief.email}`,
    '',
    ...lines.flatMap((line) => [line, '']),
  ].join('\n');

  const response = await fetch(`https://${env.ZOHO_MAIL_HOST}/api/accounts/${env.ZOHO_ACCOUNT_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${await accessToken(env)}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      fromAddress: env.BRIEF_FROM,
      toAddress: env.BRIEF_TO,
      subject: `Enquiry: ${brief.organisation} (${brief.name})`,
      content,
      mailFormat: 'plaintext',
    }),
  });

  if (!response.ok) {
    // A rejected token should be re-fetched on the next submission.
    if (response.status === 401) cachedToken = null;
    throw new Error(`send ${response.status}`);
  }
}
