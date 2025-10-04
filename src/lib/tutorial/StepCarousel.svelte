<script lang="ts">
	import StepSlide from "@components/tutorial/StepSlide.svelte";

	let hasScrolled = false;

	let isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) && !(window as any).MSStream;

	const downloadInformationURLs = {
		deepLink: "instagram://download_your_information",
		webLink: "https://accountscenter.instagram.com/info_and_permissions/dyi/",
	};

	function handleOpenInstagram() {
        if (isIOS) {
			document.location = downloadInformationURLs.deepLink;
			setTimeout(function () {
				if (confirm(`Bummer`)) {
					window.open(downloadInformationURLs.webLink, "_blank")?.focus();
				}
			}, 300);
		} else {
            window.open(downloadInformationURLs.webLink, "_blank")?.focus();
        }
    }

	function trackTutorialScroll() {
		if (typeof window.plausible !== 'undefined' && !hasScrolled) {
			window.plausible("More Info: Scroll Tutorial");
			hasScrolled = true;
		}
	}
</script>

<ol class="carousel" on:scroll={() => trackTutorialScroll()}>
	<StepSlide>
		<div>
			<button on:click={handleOpenInstagram}>{isIOS ? "Open" : "Go to"} Instagram’s <strong>Download your information</strong> page.</button>
			<p>Select <strong>Create Export</strong>.</p>
		</div>
		<img src="/tutorial/1 Landing.png" alt="The Instagram “download your information” tool landing page." loading="lazy">
	</StepSlide>
	
	<StepSlide>
		<p>Select a single Instagram account.</p>
		<img src="/tutorial/2 Select Account.png" alt="A selection list of your Meta accounts. One single Instagram account is selected." loading="lazy">
	</StepSlide>
	
	<StepSlide>
		<p>Select <strong>Export to your device</strong>.</p>
		<img src="/tutorial/3 Download Device.png" alt="Choose where to export. You can export info to your device or to an external service. 'Export to device' is selected." loading="lazy">
	</StepSlide>
	
	<StepSlide>
		<p>Select <strong>Customize information</strong>.</p>
		<img src="/tutorial/4 Configure.png" alt="Confirm your export. The 'Customize information' button is highlighted." loading="lazy">
	</StepSlide>
	
	<StepSlide>
		<p>Scroll to <strong>Followers and following</strong> and select it.</p>
		<p>You can leave everything else turned off.</p>
		<img src="/tutorial/5 Only Followers Following.png" alt="A list of the types of downloadable data. The only type selected is 'Followers and following' under the 'Connections' section." loading="lazy">
	</StepSlide>

	<StepSlide>
		<p>Set <strong>Date range</strong> to <strong>All time</strong>.</p>
		<p>Set <strong>Format</strong> to <strong>JSON</strong>.</p>
		<p>Select <strong>Start export</strong>.</p>
		<img src="/tutorial/6 Create Files.png" alt="Create files to download. Date range: All time. Format: JSON." loading="lazy">
	</StepSlide>

	<StepSlide>
		<p>Wait for Instagram to generate the files This could take a few minutes if you’re popular.</p>
		<p>Download it when it’s ready.</p>
		<img src="/tutorial/7 Archive Ready.png" alt="Current activity. Available downloads: one file set." loading="lazy">
	</StepSlide>
</ol>

<style>
    .carousel {
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -ms-overflow-style: none;
		margin: 0 calc(var(--space-m) * -1);
		padding: 40px;
    }

    .carousel::-webkit-scrollbar {
        display: none;
    }

    ol {
        list-style: none;
        counter-reset: tutorial;
        display: flex;
        gap: var(--space-m);
    }

	/* style the button to look and act like a regular link */
	button {
		background: none;
		border: none;
		color: var(--accent-color);
		cursor: pointer;
		font-size: inherit;
		margin: 0;
		padding: 0;
		text-decoration: underline;
		text-align: unset;
	}
</style>