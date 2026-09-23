import JSZip from 'jszip';
import { InstagramDataError } from '@utils/errors';
import type { ProcessedData, InstagramUser, RelationshipInfo } from '@/types/instagram';
import { findConnectionsDirectory } from '@workers/fileProcessing';
import { parseHTMLContent } from '@workers/htmlParser';
import { parseJSONContent } from '@workers/jsonParser';

const MISSING_LISTS = 'This export doesn’t include Followers and following. Create a new export with that selected.';

async function processFile(file: JSZip.JSZipObject, isFollowing: boolean): Promise<InstagramUser[]> {
  const content = await file.async('string');
  return file.name.endsWith('.html') ? parseHTMLContent(content) : parseJSONContent(content, isFollowing);
}

export async function processZipFile(file: File): Promise<ProcessedData> {
  const zip = new JSZip();
  let contents: JSZip;
  try {
    contents = await zip.loadAsync(file);
  } catch (err) {
    console.error("JSZip error:", err);
    throw new InstagramDataError('This ZIP can’t be opened. Download it from Instagram again.');
  }

  const connectionsDir = await findConnectionsDirectory(contents);
  if (!connectionsDir) {
    throw new InstagramDataError(MISSING_LISTS);
  }

  const followersAndFollowingDir = connectionsDir.folder('followers_and_following');
  if (!followersAndFollowingDir) {
    throw new InstagramDataError(MISSING_LISTS);
  }

  // Large accounts get followers_1, followers_2, ... so read every chunk.
  const followerFiles = followersAndFollowingDir.file(/^followers(_\d+)?\.(json|html)$/).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const followingFile = followersAndFollowingDir.file('following.html') ?? followersAndFollowingDir.file('following.json');

  if (followerFiles.length === 0 || !followingFile) {
    throw new InstagramDataError(MISSING_LISTS);
  }

  const followers = (await Promise.all(followerFiles.map(f => processFile(f, false)))).flat();
  const following = await processFile(followingFile, true);

  const followerSet = new Set(followers.map(f => f.username));
  const followingSet = new Set(following.map(f => f.username));
  
  const notFollowingBack: RelationshipInfo[] = following.filter(f => !followerSet.has(f.username));
  const notFollowedBack: RelationshipInfo[] = followers.filter(f => !followingSet.has(f.username));
  const mutuals: RelationshipInfo[] = followers.filter(f => followingSet.has(f.username));  

  return {
    notFollowingBack,
    notFollowedBack,
    mutuals
  };
}