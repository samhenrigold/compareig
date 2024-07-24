<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	const dispatch = createEventDispatcher<{ fileSelected: { file: File } }>();

	let dragOver = false;
	let fileInput: HTMLInputElement;

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files[0];
		handleFile(file);
	}

	function handleFileInput(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		handleFile(file);
	}

	function handleFile(file: File | undefined) {
		if (file && file.type === "application/zip") {
			dispatch("fileSelected", { file });
		} else {
			alert("Please select a ZIP file");
		}
	}

	onMount(() => {
		const handleGlobalDrag = (e: DragEvent) => {
			e.preventDefault();
			dragOver = true;
		};

		const handleGlobalDragLeave = () => {
			dragOver = false;
		};

		document.body.addEventListener("dragover", handleGlobalDrag);
		document.body.addEventListener("dragleave", handleGlobalDragLeave);
		document.body.addEventListener("drop", handleDrop);

		return () => {
			document.body.removeEventListener("dragover", handleGlobalDrag);
			document.body.removeEventListener(
				"dragleave",
				handleGlobalDragLeave
			);
			document.body.removeEventListener("drop", handleDrop);
		};
	});
</script>

<button
	class="drop-zone"
	class:drag-over={dragOver}
	on:click={() => fileInput.click()}
	tabindex="0"
	aria-label="Drop Instagram data takeout ZIP file here or click to select"
>
	<p>Drop your Instagram data takeout ZIP file here</p>
	<p>or</p>
	<p class="fake-button">Select a file</p>
	<input
		id="file-input"
		type="file"
		accept=".zip"
		on:change={handleFileInput}
		bind:this={fileInput}
	/>
</button>

<style>
	.drop-zone {
		margin: 0 auto;
		border: 2px dashed var(--border-color);
		border-radius: 1rem;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		background-color: var(--secondary-bg);
		font-size: 1rem;
	}

	.drop-zone:hover,
	.drop-zone:focus,
	.drag-over {
		background-color: var(--hover-bg);
		border-color: var(--hover-border);
	}

	.drop-zone:focus {
		outline: 2px solid var(--accent-color);
		outline-offset: 2px;
	}

	input[type="file"] {
		display: none;
	}

	.fake-button {
		background-color: var(--accent-color);
		color: #fff;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.fake-button:hover {
		background-color: var(--button-hover-bg);
	}

	@media (forced-colors: active) {
		.drop-zone {
			border: 2px solid ButtonText;
		}
	}
</style>
