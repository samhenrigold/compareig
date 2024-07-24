import { DOMParser } from 'xmldom';
import { InstagramDataError } from '@utils/errors';
import type { InstagramUser } from '@/types/instagram';

export function parseHTMLContent(html: string): InstagramUser[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const mainContent = doc.getElementsByTagName('body')[0];

  if (!mainContent) {
    throw new InstagramDataError('Could not find main content in HTML');
  }

  const users: InstagramUser[] = [];
  const rows = mainContent.getElementsByTagName('div');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.getAttribute('class')?.includes('pam _3-95 _2ph- _a6-g') ?? false) {
      const usernameElement = row.getElementsByTagName('a')[0];
      const timestampElement = row.getElementsByTagName('div')[1];

      if (usernameElement && timestampElement) {
        const username = usernameElement.textContent?.trim() ?? '';
        const timestampStr = timestampElement.textContent?.trim() ?? '';
        const timestamp = new Date(timestampStr).getTime();

        users.push({ username, timestamp });
      }
    }
  }

  return users;
}