/** Shared prop types for the site shell. */

export interface NavLink {
  href: string;
  label: string;
  /** When present the item renders as a dropdown instead of a plain link. */
  children?: NavLink[];
}

export type FooterVariant = 'corporate' | 'service';

/** Which of the design systems a page belongs to. */
export type SystemVariant = 'home' | 'service' | 'policy';
