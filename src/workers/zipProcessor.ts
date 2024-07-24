import JSZip from 'jszip';
import { InstagramDataError } from '@utils/errors';
import type { ProcessedData, InstagramUser } from '@/types/instagram';
import { findConnectionsDirectory } from '@workers/fileProcessing';
import { parseHTMLContent } from '@workers/htmlParser';
import { parseJSONContent, isValidInstagramData } from '@workers/jsonParser';
import { setDifference, setIntersection } from '@utils/set';

async function processFile(file: JSZip.JSZipObject, isFollowing: boolean): Promise<InstagramUser[]> {
  const content = await file.async('string');
  
  if (file.name.endsWith('.html')) {
    return parseHTMLContent(content);
  } else if (file.name.endsWith('.json')) {
    try {
      const parsedData = JSON.parse(content);
      if (!isValidInstagramData(parsedData)) {
        throw new InstagramDataError(`Invalid Instagram data structure in ${file.name}`);
      }
      return parseJSONContent(content, isFollowing);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new InstagramDataError(`Invalid JSON in ${file.name}: ${error.message}`);
      }
      throw error;
    }
  } else {
    throw new InstagramDataError(`Unsupported file type: ${file.name}`);
  }
}

export async function processZipFile(file: File): Promise<ProcessedData> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch (error) {
    throw new InstagramDataError('Failed to load ZIP file. Is it a valid ZIP archive?');
  }

  const connectionsDir = await findConnectionsDirectory(zip);
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

  let followers: InstagramUser[], following: InstagramUser[];
  try {
    followers = await processFile(followersFile, false);
    following = await processFile(followingFile, true);
  } catch (error) {
    if (error instanceof InstagramDataError) {
      throw error;
    }
    throw new InstagramDataError('Error processing Instagram data files');
  }

  const followerSet = new Set(followers.map(f => f.username));
  const followingSet = new Set(following.map(f => f.username));

  return {
    notFollowingBack: setDifference(followingSet, followerSet),
    notFollowedBack: setDifference(followerSet, followingSet),
    mutuals: setIntersection(followerSet, followingSet)
  };
}
