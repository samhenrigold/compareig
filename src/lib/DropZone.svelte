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
        if (file && (file.type === "application/zip" || file.type === "application/x-zip-compressed" || file.name.endsWith(".zip"))) {
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
    aria-label="Drop Instagram ZIP file here or click to select"
>
    <p>Drop your Instagram ZIP file here</p>
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
        margin: var(--space-m) auto;
        border: 2px dashed var(--border-color);
        border-radius: var(--space-s);
        padding: var(--space-l);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.3s ease, border-color 0.3s ease;
        background-color: var(--secondary-bg);
        font-size: var(--text-0);
        width: 100%;
    }

    .drop-zone:hover,
    .drop-zone:focus,
    .drag-over {
        background-color: var(--highlight-bg);
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
        padding: var(--space-2xs) var(--space-s);
        border-radius: var(--space-3xs);
        cursor: pointer;
        margin-top: var(--space-s);
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