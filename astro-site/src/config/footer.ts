import type { NavLink } from '../types';
import { ENQUIRY_LABEL, ENQUIRY_URL } from './contact';

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
      { href: '/yoruba-speech-data', label: 'Yorùbá speech data' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/services', label: 'All services' },
      { href: '/african-data-collection-services', label: 'Data collection' },
      { href: '/annotation-labelling-services', label: 'Annotation & labelling' },
      { href: '/ai-training-data-compliance-nigeria', label: 'Compliance support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/faq', label: 'FAQ' },
      { href: ENQUIRY_URL, label: ENQUIRY_LABEL },
    ],
  },
];

/**
 * Not yet ported — add to the columns above as each page lands.
 *
 *   Data:    /african-ai-training-data-types       Data types
 *            /nigerian-english-speech-data         Nigerian English speech
 *            /nigerian-language-data               Nigerian language data
 *            /african-image-data                   African image data
 *            /african-video-data                   African video data
 */
