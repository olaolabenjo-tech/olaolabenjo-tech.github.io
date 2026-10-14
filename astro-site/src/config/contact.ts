/**
 * Pre-filled emails used on more than one page. Keep a template here once it
 * has a second caller, so the copies cannot drift apart.
 */

/**
 * The enquiry form (src/pages/brief.astro) and the one label every button to
 * it uses: the header, the footer, the homepage hero and #samples, and both
 * speech pages. Change the wording here, not on each button.
 */
export const ENQUIRY_URL = '/brief';
export const ENQUIRY_LABEL = 'Send an enquiry';

/**
 * Enquiry by email: the form's fallback when sending fails. The form builds
 * the message from the visitor's answers, so only the address is needed.
 */
export const ENQUIRY_MAILTO = 'mailto:dataservices@bsgdataworks.com';


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
