export interface InstagramUser {
  username: string;
  timestamp: number;
}

export interface InstagramUserJSON {
  string_list_data: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

export interface InstagramData {
  relationships_following: InstagramUserJSON[];
}

export interface ProcessedData {
  notFollowingBack: string[];
  notFollowedBack: string[];
  mutuals: string[];
}
