<script lang="ts">
    export let title: string;
    export let users: string[];
</script>

<section>
    <h3>{title} ({users.length})</h3>
    {#if users.length > 0}
        <ul>
            {#each users as user}
                <li>{user}</li>
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
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: var(--space-xs);
    }

    li {
        background-color: var(--secondary-bg);
        padding: var(--space-xs);
        border-radius: var(--space-3xs);
        overflow-wrap: break-word;
    }
</style>
