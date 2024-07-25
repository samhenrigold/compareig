import * as cheerio from 'cheerio';
import { InstagramDataError } from '@/utils/errors';
import type { InstagramUser } from '@/types/instagram';

export function parseHTMLContent(html: string): InstagramUser[] {
  const $ = cheerio.load(html);
  const users: InstagramUser[] = [];

  $('.pam._3-95._2ph-._a6-g.uiBoxWhite.noborder').each((_, element) => {
    const $element = $(element);
    const $usernameElement = $element.find('a');
    const $timestampElement = $element.find('div > div > div').last();

    if ($usernameElement.length && $timestampElement.length) {
      const username = $usernameElement.text().trim();
      const timestampStr = $timestampElement.text().trim();
      const timestamp = parseTimestamp(timestampStr);

      users.push({ username, timestamp });
    }
  });

  if (users.length === 0) {
    throw new InstagramDataError('No user data found in the HTML');
  }

  return users;
}

function parseTimestamp(timestampStr: string): number {
  const date = new Date(timestampStr);
  return Math.floor(date.getTime() / 1000); // Convert to seconds to match JSON format
}
