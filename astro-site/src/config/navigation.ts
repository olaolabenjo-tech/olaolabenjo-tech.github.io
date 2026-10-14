import type { NavLink } from '../types';
import { ENQUIRY_LABEL, ENQUIRY_URL } from './contact';

/**
 * The site-wide header menu. One menu on every page.
 *
 * Every target must resolve — no dead links while the migration is in
 * progress. Items whose pages are not ported yet are parked in PENDING below
 * and moved up as each one lands.
 *
 * Targets are real URLs rather than in-page anchors, because the same menu
 * renders everywhere. "Send an enquiry" goes to the enquiry form at /brief.
 * The last item is
 * styled as the call to action — keep it last.
 */
export const SITE_NAV: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { href: '/services', label: 'All services' },
      { href: '/african-data-collection-services', label: 'Data collection' },
      { href: '/annotation-labelling-services', label: 'Annotation & labelling' },
      { href: '/ai-training-data-compliance-nigeria', label: 'Compliance support' },
    ],
  },
  {
    label: 'Languages',
    href: '/language-coverage',
    children: [
      { href: '/language-coverage', label: 'All language coverage' },
      { href: '/african-speech-data', label: 'African speech data' },
      { href: '/yoruba-speech-data', label: 'Yorùbá speech data' },
    ],
  },
  { href: ENQUIRY_URL, label: ENQUIRY_LABEL },
];

/**
 * Not yet ported — add back to SITE_NAV as each page lands.
 *
 *   top level:
 *     { href: '/african-ai-training-data-types',       label: 'Data types' }
 *
 *   inside the Languages dropdown:
 *     { href: '/nigerian-english-speech-data', label: 'Nigerian English speech' }
 *     { href: '/nigerian-language-data',       label: 'Nigerian language data' }
 */
