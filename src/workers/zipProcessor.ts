import JSZip from 'jszip';
import { InstagramDataError } from '@utils/errors';
import type { ProcessedData, InstagramUser } from '@/types/instagram';
import { findConnectionsDirectory } from '@workers/fileProcessing';
import { parseHTMLContent } from '@workers/htmlParser';
import { parseJSONContent } from '@workers/jsonParser';
import { setDifference, setIntersection } from '@utils/set';

async function processFile(file: JSZip.JSZipObject, isFollowing: boolean): Promise<InstagramUser[]> {
  const content = await file.async('string');
  return file.name.endsWith('.html') ? parseHTMLContent(content) : parseJSONContent(content, isFollowing);
}

export async function processZipFile(file: File): Promise<ProcessedData> {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);

  const connectionsDir = await findConnectionsDirectory(contents);
  if (!connectionsDir) {
    throw new InstagramDataError('Connections directory not found in the ZIP');
  }

  const followersAndFollowingDir = connectionsDir.folder('followers_and_following');
  if (!followersAndFollowingDir) {
    throw new InstagramDataError('followers_and_following directory not found');
  }

  const followersFile = followersAndFollowingDir.file('followers_1.html') ?? followersAndFollowingDir.file('followers_1.json');
  const followingFile = followersAndFollowingDir.file('following.html') ?? followersAndFollowingDir.file('following.json');

  if (!followersFile || !followingFile) {
    throw new InstagramDataError('Required files not found in the ZIP');
  }

  const followers = await processFile(followersFile, false);
  const following = await processFile(followingFile, true);

  const followerSet = new Set(followers.map(f => f.username));
  const followingSet = new Set(following.map(f => f.username));

  return {
    notFollowingBack: setDifference(followingSet, followerSet),
    notFollowedBack: setDifference(followerSet, followingSet),
    mutuals: setIntersection(followerSet, followingSet)
  };
}
