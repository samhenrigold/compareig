<script lang="ts">
	import FileDropZone from "@components/DropZone.svelte";
	import ResultsList from "@components/ResultsList.svelte";
	import type { ProcessedData } from "@/types/instagram";
	import "./app.css";

	let results: ProcessedData | null = null;
	let loading = false;
	let error: string | null = null;

	async function handleFileSelect(file: File) {
		loading = true;
		error = null;

		try {
			const worker = new Worker(new URL("./worker.ts", import.meta.url), {
				type: "module",
			});

			const result = await new Promise<ProcessedData>(
				(resolve, reject) => {
					worker.onmessage = (e: MessageEvent) => {
						if ("error" in e.data) {
							reject(new Error(e.data.error));
						} else {
							resolve(e.data as ProcessedData);
						}
					};
					worker.postMessage(file);
				}
			);

			results = result;
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	}
</script>

<main>
	<h1>Instagram Follower Analyzer</h1>

  <details class="info">
		<summary>
      <h2>How it works</h2>
    </summary>
		<p>
			This tool helps you analyze your Instagram followers and following list. It’s completely safe to use, and here's why:
		</p>
		<ul>
			<li>Your data stays on your device. We never upload or store your information on any servers.</li>
			<li>All processing happens right here in your browser.</li>
			<li>You can use this tool offline once the page has loaded.</li>
			<li>We only read the followers and following lists from your Instagram data. Nothing else is accessed.</li>
		</ul>
	</details>

	<FileDropZone on:fileSelected={(e) => handleFileSelect(e.detail.file)} />

	{#if loading}
		<p aria-live="polite">Processing your data. Please wait...</p>
	{:else if error}
		<p class="error" role="alert">{error}</p>
	{:else if results}
		<section aria-label="Analysis Results">
			<h2>Results</h2>
			<ResultsList
				title="Not following you back"
				users={results.notFollowingBack}
			/>
			<ResultsList
				title="Not followed back"
				users={results.notFollowedBack}
			/>
			<ResultsList title="Mutuals" users={results.mutuals} />
		</section>
	{/if}
</main>

<style>
	:global(body) {
		position: relative;
		min-height: 100vh;
	}

	main {
		max-inline-size: 800px;
		margin-inline: auto;
		padding-block: 2rem;
		padding-inline: 1rem;
		font-family: system-ui, sans-serif;
	}

	h1 {
		font-size: clamp(1.5rem, 5vw, 2.5rem);
		text-align: center;
		margin-block-end: 2rem;
	}

	.error {
		color: var(--error-text);
		background-color: var(--error-bg);
		padding: 1rem;
		border-radius: 0.5rem;
		font-weight: bold;
	}

  .info {
		background-color: var(--secondary-bg);
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.info h2 {
    display: inline;
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	.info ul {
		padding-left: 1.5rem;
		margin-bottom: 1rem;
	}

	.info li {
		margin-bottom: 0.5rem;
	}
</style>