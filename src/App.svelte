<script lang="ts">
	import { onMount } from "svelte";
	import FileDropZone from "@components/DropZone.svelte";
	import ResultsList from "@components/ResultsList.svelte";
	import StepCarousel from "@components/tutorial/StepCarousel.svelte";
	import type { ProcessedData } from "@/types/instagram";
	import { generateRichTextResults } from "@/utils/richTextGenerator";
	import "./app.css";

	let results: ProcessedData | null = null;
	let loading = false;
	let error: string | null = null;

	function copyRichTextResults() {
		if (results) {
			const richText = generateRichTextResults(results);
			const blob = new Blob([richText], { type: "text/html" });
			const clipboardItem = new ClipboardItem({ "text/html": blob });

			navigator.clipboard
				.write([clipboardItem])
				.then(() => {
					alert("Results copied to clipboard!");
				})
				.catch((err) => {
					console.error("Failed to copy rich text: ", err);
					// Fallback to plain text
					navigator.clipboard.writeText(richText).then(() => {
						alert("Results copied to clipboard!");
					});
				});
		}
	}

	async function loadTestFile() {
		try {
			const response = await fetch(
				"/test/instagram-samhenrigold-2024-07-16-tiRxj9oM.zip"
			);
			if (response.ok) {
				const blob = await response.blob();
				const file = new File(
					[blob],
					"instagram-samhenrigold-2024-07-16-tiRxj9oM.zip",
					{ type: "application/zip" }
				);
				await handleFileSelect(file);
			}
		} catch (err) {
			console.error("Failed to load test file:", err);
		}
	}

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

	onMount(() => {
		if (window.location.hostname === "localhost") {
			loadTestFile();
		}
	});
</script>

<main>
	<h1>Compare Instagram Followers</h1>

	<details class="info">
		<summary>
			<h2>How it works</h2>
		</summary>
		<StepCarousel />
		<ul>
			<li>
				Your data stays on your device. We never upload or store your
				information on any servers.
			</li>
			<li>All processing happens right here in your browser.</li>
			<li>You can use this tool offline once the page has loaded.</li>
			<li>
				We only read the followers and following lists from your
				Instagram data. Nothing else is accessed.
			</li>
		</ul>
		<p>
			Still not sure? The <a
				href="https://github.com/samhenrigold/compareig"
				target="_blank">source code is available</a
			> and accepting contributions!
		</p>
		<p>A web tool by <a href="https://samhenri.gold">Sam Henri Gold</a></p>
	</details>

	<FileDropZone on:fileSelected={(e) => handleFileSelect(e.detail.file)} />

	{#if loading}
		<p aria-live="polite">Processing your data. Please wait...</p>
	{:else if error}
		<p class="error" role="alert">{error}</p>
	{:else if results}
		<section aria-label="Analysis Results">
			<h2>Results</h2>
			<p>
				Want to save this for later? Copy and paste this into your Notes
				app.
			</p>
			<button on:click={copyRichTextResults}>Copy Results</button>
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
	main {
		max-inline-size: 65ch;
		margin-inline: auto;
		padding-block: var(--space-l);
		padding-inline: var(--space-m);
		font-family: system-ui, sans-serif;
	}

	h1 {
		font-size: var(--text-4);
		text-align: center;
		margin-block-end: var(--space-l);
	}

	.error {
		color: var(--error-text);
		background-color: var(--error-bg);
		padding: var(--space-s);
		border-radius: var(--space-2xs);
		font-weight: bold;
	}

	.info {
		background-color: var(--highlight-bg);
		border-radius: var(--space-2xs);
		padding: var(--space-m);
		margin-bottom: var(--space-l);
		padding-left: var(--space-m);
	}

	.info p {
		padding-left: var(--space-m);
	}

	.info h2 {
		display: inline;
		font-size: var(--text-1);
		margin-bottom: var(--space-s);
	}

	.info p:last-of-type {
		margin-top: var(--space-m);
		opacity: 0.7;
	}

	.info ul {
		margin-bottom: var(--space-s);
		padding-left: var(--space-m);
	}

	.info li {
		margin-bottom: var(--space-2xs);
	}

	button {
		background-color: var(--accent-color);
		color: #fff;
		padding: var(--space-xs) var(--space-s);
		border: none;
		border-radius: var(--space-3xs);
		cursor: pointer;
		font-size: var(--text-0);
		margin-bottom: var(--space-m);
	}

	button:hover {
		background-color: var(--button-hover-bg);
	}
</style>
