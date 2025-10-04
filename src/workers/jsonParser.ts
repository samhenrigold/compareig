import type { InstagramUser, InstagramUserJSON } from '@/types/instagram';

export function parseJSONContent(content: string, isFollowing: boolean): InstagramUser[] {
  const data = JSON.parse(content);
  const users = isFollowing ? data.relationships_following : data;

  return users.map((user: InstagramUserJSON) => {
    // New format: username is in 'title' field
    // Old format: username is in string_list_data[0].value
    const username = user.title || user.string_list_data[0].value;
    const timestamp = user.string_list_data[0].timestamp;
    
    if (!username) {
      throw new Error('Username not found in Instagram data');
    }
    
    return {
      username,
      timestamp
    };
  });
}