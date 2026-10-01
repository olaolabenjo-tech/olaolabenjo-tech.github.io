import type { NavLink } from '../types';

/**
 * The site-wide header menu. One menu on every page.
 *
 * Every target must resolve — no dead links while the migration is in
 * progress. Items whose pages are not ported yet are parked in PENDING below
 * and moved up as each one lands.
 *
 * Targets are real URLs rather than in-page anchors, because the same menu
 * renders everywhere; the two homepage anchors are absolute so they work from
 * any page. The last item is styled as the call to action — keep it last.
 */
export const SITE_NAV: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  {
    label: 'Languages',
    href: '/language-coverage',
    children: [
      { href: '/language-coverage', label: 'All language coverage' },
      { href: '/african-speech-data', label: 'African speech data' },
      { href: '/yoruba-speech-data', label: 'Yorùbá speech data' },
    ],
  },
  { href: '/#contact', label: 'Start a brief' },
];

/**
 * Not yet ported — add back to SITE_NAV as each page lands.
 *
 *   top level:
 *     { href: '/african-ai-training-data-types',       label: 'Data types' }
 *     { href: '/ai-training-data-compliance-nigeria',  label: 'Compliance' }
 *
 *   inside the Languages dropdown:
 *     { href: '/nigerian-english-speech-data', label: 'Nigerian English speech' }
 *     { href: '/nigerian-language-data',       label: 'Nigerian language data' }
 */
