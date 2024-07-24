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
		margin-block: 2rem;
	}

	h3 {
		font-size: 1.2rem;
		margin-block-end: 0.5rem;
	}

	ul {
		list-style-type: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.5rem;
	}

	li {
		background-color: var(--secondary-bg);
		padding: 0.5rem;
		border-radius: 0.25rem;
		overflow-wrap: break-word;
	}
</style>