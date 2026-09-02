/** Shared prop types for the site shell. */

export interface NavLink {
  href: string;
  label: string;
}

export type FooterVariant = 'corporate' | 'service';

/** Which of the two design systems a page belongs to. */
export type SystemVariant = 'home' | 'service';
