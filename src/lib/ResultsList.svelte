<script lang="ts">
    import type { RelationshipInfo } from '@/types/instagram';

    export let title: string;
    export let users: RelationshipInfo[];

    function formatDuration(duration: RelationshipInfo['duration']) {
        if (!duration) return '';
        switch (duration.type) {
            case 'fan':
                return `they’ve followed you for ${duration.time}`;
            case 'idol':
                return `you’ve followed them for ${duration.time}`;
            case 'mutual':
                return `mutuals for ${duration.time}`;
        }
    }
</script>

<section>
    <h3>{title} ({users.length})</h3>
    {#if users.length > 0}
        <ul>
            {#each users as user}
                <li>
                    <a href="https://instagram.com/{user.username}" target="_blank">
                        <span>@{user.username}</span>
                        {#if user.duration}
                        <p class="duration">{formatDuration(user.duration)}</p>
                        {/if}
                    </a>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No users in this category.</p>
    {/if}
</section>

<style>
    section {
        margin-block: var(--space-l);
    }

    h3 {
        font-size: var(--text-1);
        color: var(--section-header-text);
        margin-block-end: var(--space-s);
        font-weight: 600;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin: 0 calc(var(--space-s) * -1);
    }

    a {
        display: block;
        color: var(--accent-color);
        text-decoration: none;
        padding: var(--space-s);
        overflow-wrap: break-word;
        border-radius: var(--space-2xs);
    }

    a span {
        font-weight: 600;
    }

    a:hover {
        background-color: var(--highlight-bg);
    }

    a:hover span {
        text-decoration: underline;
    }

    p.duration {
        color: var(--secondary-text);
        margin: var(--space-3xs) 0 0;
    }
</style>