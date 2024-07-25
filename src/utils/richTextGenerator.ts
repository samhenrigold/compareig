import * as cheerio from 'cheerio';
import type { ProcessedData, RelationshipInfo } from '@/types/instagram';

function formatUserList($: cheerio.CheerioAPI, users: RelationshipInfo[], title: string): cheerio.Cheerio<cheerio.AnyNode> {
    const $section = $('<section>');
    $section.append($(`<h2>${title} (${users.length})</h2>`));

    const $ul = $('<ul>');

    users.forEach(user => {
        const $li = $('<li>');
        const $a = $(`<a href="https://instagram.com/${user.username}"><strong>@${user.username}</strong></a>`);
        $li.append($a);

        if (user.duration) {
            $li.append(` - ${formatDuration(user.duration)}`);
        }

        $ul.append($li);
    });

    $section.append($ul);
    return $section;
}

function formatDuration(duration: NonNullable<RelationshipInfo['duration']>): string {
    switch (duration.type) {
        case 'fan':
            return `they've followed you for ${duration.time}`;
        case 'idol':
            return `you've followed them for ${duration.time}`;
        case 'mutual':
            return `mutuals for ${duration.time}`;
    }
}

export function generateRichTextResults(results: ProcessedData): string {
    const $ = cheerio.load('<div></div>');
    const $container = $('div');

    const now = new Date();
    const localDateString = now.toLocaleString();

    $container.append($('<h1>Instagram Follower Analysis</h1>'));
    $container.append($(`<p>Generated on ${localDateString} via <a href="https://compareig.com">compareig.com</a></p>`));

    $container.append(formatUserList($, results.notFollowingBack, 'Not following you back'));
    $container.append(formatUserList($, results.notFollowedBack, 'Not followed back'));
    $container.append(formatUserList($, results.mutuals, 'Mutuals'));

    return $.html();
}
