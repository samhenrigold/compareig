import type { InstagramUser, InstagramUserJSON } from '@/types/instagram';

interface FollowingData {
  relationships_following: InstagramUserJSON[];
}

interface FollowerData extends InstagramUserJSON {}

export function parseJSONContent(content: string, isFollowing: boolean): InstagramUser[] {
  let data: FollowingData | FollowerData;
  try {
    data = JSON.parse(content) as FollowingData | FollowerData;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    throw new Error('Invalid JSON format in the Instagram data file');
  }

  const users = isFollowing 
    ? (data as FollowingData).relationships_following 
    : [(data as FollowerData)];

  return users.flatMap((user: InstagramUserJSON) => 
    user.string_list_data.map((item): InstagramUser => ({
      username: item.value,
      timestamp: item.timestamp
    }))
  );
}

export function isValidInstagramData(data: unknown): data is FollowingData | FollowerData {
  if (typeof data !== 'object' || data === null) return false;

  if ('relationships_following' in data) {
    return Array.isArray((data as FollowingData).relationships_following);
  }

  if ('string_list_data' in data) {
    return Array.isArray((data as FollowerData).string_list_data);
  }

  return false;
}