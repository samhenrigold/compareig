import type { InstagramUser, InstagramUserJSON } from '@/types/instagram';

export function parseJSONContent(content: string, isFollowing: boolean): InstagramUser[] {
  const data = JSON.parse(content);
  const users = isFollowing ? data.relationships_following : data;

  return users.map((user: InstagramUserJSON) => ({
    username: user.string_list_data[0].value,
    timestamp: user.string_list_data[0].timestamp
  }));
}