export interface InstagramUser {
  username: string;
  timestamp: number;
}

export interface InstagramUserJSON {
  title?: string; // New format: username is in title field
  string_list_data: Array<{
    href: string;
    value?: string; // Old format: username is in value field
    timestamp: number;
  }>;
}

export interface InstagramData {
  relationships_following: InstagramUserJSON[];
}

export interface RelationshipInfo {
  username: string;
  timestamp?: number;
  duration?: {
    type: 'fan' | 'idol' | 'mutual';
    time: string;
  };
}

export interface ProcessedData {
  notFollowingBack: RelationshipInfo[];
  notFollowedBack: RelationshipInfo[];
  mutuals: RelationshipInfo[];
}