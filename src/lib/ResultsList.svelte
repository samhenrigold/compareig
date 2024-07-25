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
                        @{user.username}
                    </a>
                    {#if user.duration}
                        <span class="duration">{formatDuration(user.duration)}</span>
                    {/if}
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
        margin-block-end: var(--space-s);
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        background-color: var(--secondary-bg);
        padding: var(--space-xs);
        border-radius: var(--space-3xs);
        margin-bottom: var(--space-xs);
        overflow-wrap: break-word;
    }

    a {
        color: var(--accent-color);
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    .duration {
        font-size: var(--text--1);
        color: var(--text-muted);
        margin-left: var(--space-2xs);
    }
</style>