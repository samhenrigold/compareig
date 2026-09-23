import type { InstagramUser, InstagramUserJSON } from '@/types/instagram';

export function parseJSONContent(content: string, isFollowing: boolean): InstagramUser[] {
  const data = JSON.parse(content);
  // Exports are either a bare array or an object wrapping one (e.g. relationships_following).
  const users: InstagramUserJSON[] | undefined = Array.isArray(data)
    ? data
    : (isFollowing && Array.isArray(data?.relationships_following) ? data.relationships_following : Object.values(data ?? {}).find(Array.isArray));
  if (!users) {
    throw new Error('This export can’t be read. Instagram may have changed its format; please report it on GitHub.');
  }

  return users.map((user: InstagramUserJSON) => {
    // New format: username is in 'title' field
    // Old format: username is in string_list_data[0].value
    const username = user.title || user.string_list_data[0].value;
    const timestamp = user.string_list_data[0].timestamp;
    
    if (!username) {
      throw new Error('This export can’t be read. Instagram may have changed its format; please report it on GitHub.');
    }
    
    return {
      username,
      timestamp
    };
  });
}