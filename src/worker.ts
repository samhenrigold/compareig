import { processZipFile } from '@workers/zipProcessor';
import { InstagramDataError } from '@utils/errors';
import { parseHTMLContent } from '@workers/htmlParser';
import type { ProcessedData } from '@/types/instagram';

async function processHTMLFile(file: File): Promise<ProcessedData> {
  const content = await file.text();
  const users = parseHTMLContent(content);

  return {
    notFollowingBack: [],
    notFollowedBack: users.map(u => u.username),
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

    if (file.type === 'application/zip') {
      result = await processZipFile(file);
    } else if (file.type === 'text/html') {
      result = await processHTMLFile(file);
    } else {
      throw new InstagramDataError('Unsupported file type. Please upload a ZIP or HTML file.');
    }

    self.postMessage(result);
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};