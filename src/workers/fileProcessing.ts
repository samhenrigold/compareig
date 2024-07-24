import JSZip from 'jszip';

export async function* processFiles(zip: JSZip): AsyncGenerator<[string, JSZip.JSZipObject]> {
  for (const [path, file] of Object.entries(zip.files)) {
    if (!file.dir) {
      yield [path, file];
    }
  }
}

export async function findConnectionsDirectory(zip: JSZip): Promise<JSZip | null> {
  if (zip.folder('connections')) {
    return zip.folder('connections')!;
  }

  for await (const [path, file] of processFiles(zip)) {
    if (file.dir && path.endsWith('connections/')) {
      return zip.folder(path)!;
    }
  }

  return null;
}
