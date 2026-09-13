import type { NavLink } from '../types';

/**
 * Footer link columns.
 *
 * Same rule as the header: every target must resolve. Pages that are not
 * ported yet are parked in PENDING below and moved up as each one lands.
 */
export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Data',
    links: [
      { href: '/language-coverage', label: 'Language coverage' },
      { href: '/african-speech-data', label: 'African speech data' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/services', label: 'Services' },
      { href: '/#contact', label: 'Start a brief' },
    ],
  },
];

/**
 * Not yet ported — add to the columns above as each page lands.
 *
 *   Data:    /african-ai-training-data-types       Data types
 *            /yoruba-speech-data                   Yorùbá speech data
 *            /nigerian-english-speech-data         Nigerian English speech
 *            /nigerian-language-data               Nigerian language data
 *   Company: /african-data-collection-services     Data collection
 *            /annotation-labelling-services        Annotation & labelling
 *            /ai-training-data-compliance-nigeria  Compliance consultancy
 */
