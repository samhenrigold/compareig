import type { RelationshipInfo } from '@/types/instagram';

export function calculateRelationshipDuration(user: RelationshipInfo, type: 'fan' | 'idol' | 'mutual'): RelationshipInfo['duration'] {
  if (!user.timestamp) return undefined;

  const now = Date.now() / 1000; // Convert to seconds to match Instagram's timestamp
  const timestamp = Math.min(user.timestamp, now); // Ensure timestamp is not in the future
  const duration = now - timestamp;
  const days = Math.floor(duration / (60 * 60 * 24));

  if (days < 1) return undefined;

  let time: string;
  if (days < 30) {
    time = `${days} day${days > 1 ? 's' : ''}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    time = `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(days / 365);
    time = `${years} year${years > 1 ? 's' : ''}`;
  }

  return { type, time };
}