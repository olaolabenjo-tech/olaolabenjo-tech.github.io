/**
 * Pre-filled emails used on more than one page. Keep a template here once it
 * has a second caller, so the copies cannot drift apart.
 */

/**
 * Dataset brief. "Start a brief" in the header and footer; it replaced the
 * homepage #contact section.
 */
export const DATASET_BRIEF_MAILTO =
  'mailto:dataservices@bsgdataworks.com?subject=Dataset%20brief&body=Hello%20BSG%20DataWorks%2C%0A%0A-%20Dataset%20type%20and%20intended%20model%20use%3A%0A-%20Languages%2C%20markets%2C%20or%20participant%20profile%3A%0A-%20Target%20volume%20and%20preferred%20format%3A%0A-%20Desired%20delivery%20timeline%3A%0A-%20Rights%2C%20governance%2C%20or%20compliance%20requirements%3A%0A-%20Approximate%20pilot%20budget%20or%20licensing%20range%2C%20if%20known%3A%0A%0AThanks%2C%0A';

/** The speech evaluation pack. Homepage hero, #samples, and the speech page. */
export const EVALUATION_PACK_MAILTO =
  'mailto:dataservices@bsgdataworks.com?subject=Evaluation%20pack%20request&body=Hello%20BSG%20DataWorks%2C%0A%0AI%20would%20like%20to%20request%20the%20speech%20evaluation%20pack.%0A%0A-%20Organisation%20and%20role%3A%0A-%20Intended%20model%20use%3A%0A-%20Languages%20or%20data%20types%20of%20interest%3A%0A-%20Any%20technical%20or%20compliance%20questions%3A%0A%0AThanks%2C%0A';

/**
 * Calendly event that "Schedule a call" opens: the full booking URL.
 *
 * Empty means not set up: the button falls back to CALL_REQUEST_MAILTO.
 */
export const CALENDLY_URL = 'https://calendly.com/soniwavetech/discovery-call';

/**
 * Call request by email. The "Schedule a call" fallback when CALENDLY_URL is
 * empty or Calendly fails to load.
 */
export const CALL_REQUEST_MAILTO =
  'mailto:dataservices@bsgdataworks.com?subject=Call%20request&body=Hello%20BSG%20DataWorks%2C%0A%0AI%20would%20like%20to%20schedule%20a%20call.%0A%0A-%20Organisation%20and%20role%3A%0A-%20What%20we%20would%20like%20to%20discuss%3A%0A-%20Two%20or%20three%20times%20that%20suit%20us%2C%20with%20time%20zone%3A%0A%0AThanks%2C%0A';
