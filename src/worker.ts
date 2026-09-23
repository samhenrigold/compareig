import { processZipFile } from '@workers/zipProcessor';
import { InstagramDataError } from '@/utils/errors';
import { parseHTMLContent } from '@workers/htmlParser';
import type { ProcessedData } from '@/types/instagram';
import { calculateRelationshipDuration } from '@/utils/relationshipDuration';

async function processHTMLFile(file: File): Promise<ProcessedData> {
  const content = await file.text();
  const users = parseHTMLContent(content);

  return {
    notFollowingBack: [],
    notFollowedBack: users.map(u => ({ username: u.username, timestamp: u.timestamp })),
    mutuals: []
  };
}

self.onmessage = async (e: MessageEvent<unknown>) => {
  if (!(e.data instanceof File)) {
    throw new Error('Invalid input: expected a File object');
  }
  const file: File = e.data;

  try {
    let result: ProcessedData;

    // Match on extension: browsers report ZIP MIME types inconsistently
    // (application/x-zip-compressed on Windows, octet-stream or empty on Android).
    const name = file.name.toLowerCase();
    if (name.endsWith('.zip')) {
      result = await processZipFile(file);
    } else if (name.endsWith('.html') || name.endsWith('.htm')) {
      result = await processHTMLFile(file);
    } else {
      throw new InstagramDataError('That isn’t a ZIP file. Upload the ZIP Instagram sent you.');
    }

    // Calculate relationship durations
    result.notFollowingBack = result.notFollowingBack.map(user => ({
      ...user,
      duration: calculateRelationshipDuration(user, 'idol')
    }));
    result.notFollowedBack = result.notFollowedBack.map(user => ({
      ...user,
      duration: calculateRelationshipDuration(user, 'fan')
    }));
    result.mutuals = result.mutuals.map(user => ({
      ...user,
      duration: calculateRelationshipDuration(user, 'mutual')
    }));

    self.postMessage(result);
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};