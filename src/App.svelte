<script lang="ts">
	import FileDropZone from "@components/DropZone.svelte";
	import ResultsList from "@components/ResultsList.svelte";
	import StepCarousel from "@components/tutorial/StepCarousel.svelte";
	import type { ProcessedData } from "@/types/instagram";
	import "./app.css";

	let results: ProcessedData | null = null;
	let loading = false;
	let error: string | null = null;
    let dialogElement: HTMLDialogElement;

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
    <h1>Compare Instagram Followers</h1>

    <details class="info">
        <summary>
            <h2>How it works</h2>
        </summary>
        <ul>
            <li>Your data stays on your device. We never upload or store your information on any servers.</li>
            <li>All processing happens right here in your browser.</li>
            <li>You can use this tool offline once the page has loaded.</li>
            <li>We only read the followers and following lists from your Instagram data. Nothing else is accessed.</li>
        </ul>
        <p>Still not sure? The <a href="https://github.com/samhenrigold/insta-diff" target="_blank">source code is available</a> and accepting contributions!</p>
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
        background-color: var(--secondary-bg);
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

    .info div {
        margin: var(--space-s) 0;
        font-size: var(--text-0);
        padding-left: var(--space-m);
    }

    .info div button {
        /* unstyle to look like a link */
        background: none;
        border: none;
        color: var(--link-color);
        cursor: pointer;
        font-size: inherit;
        text-decoration: underline;
        padding: 0;
        margin: 0;
        font-weight: 600;
    }

    .info ul {
        margin-bottom: var(--space-s);
        padding-left: var(--space-m);
    }

    .info li {
        margin-bottom: var(--space-2xs);
    }
</style>