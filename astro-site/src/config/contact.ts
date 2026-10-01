/**
 * Pre-filled emails used on more than one page. Keep a template here once it
 * has a second caller, so the copies cannot drift apart.
 */

/** The speech evaluation pack. Homepage hero, #samples, and the speech page. */
export const EVALUATION_PACK_MAILTO =
  'mailto:dataservices@bsgdataworks.com?subject=Evaluation%20pack%20request&body=Hello%20BSG%20DataWorks%2C%0A%0AI%20would%20like%20to%20request%20the%20speech%20evaluation%20pack.%0A%0A-%20Organisation%20and%20role%3A%0A-%20Intended%20model%20use%3A%0A-%20Languages%20or%20data%20types%20of%20interest%3A%0A-%20Any%20technical%20or%20compliance%20questions%3A%0A%0AThanks%2C%0A';

/**
 * Call request. There is no booking page yet, so this asks for times by
 * email; swap it for the booking URL when one exists.
 */
export const CALL_REQUEST_MAILTO =
  'mailto:dataservices@bsgdataworks.com?subject=Call%20request&body=Hello%20BSG%20DataWorks%2C%0A%0AI%20would%20like%20to%20schedule%20a%20call.%0A%0A-%20Organisation%20and%20role%3A%0A-%20What%20we%20would%20like%20to%20discuss%3A%0A-%20Two%20or%20three%20times%20that%20suit%20us%2C%20with%20time%20zone%3A%0A%0AThanks%2C%0A';
