import type { ProcessedData, RelationshipInfo } from '@/types/instagram';

function formatUserList(users: RelationshipInfo[], title: string): string {
    const formattedUsers = users.map(user => {
        const duration = user.duration ? ` (${user.duration.type} for ${user.duration.time})` : '';
        return `- @${user.username}${duration}`;
    }).join('\n');

    return `${title} (${users.length}):\n${formattedUsers}\n\n`;
}

export function generateRichTextResults(results: ProcessedData): string {
    let richText = 'Instagram Follower Analysis\n\n';

    richText += formatUserList(results.notFollowingBack, 'Not following you back');
    richText += formatUserList(results.notFollowedBack, 'Not followed back');
    richText += formatUserList(results.mutuals, 'Mutuals');

    return richText;
}