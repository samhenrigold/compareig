<script lang="ts">
	import StepSlide from "@components/tutorial/StepSlide.svelte";
	import { onMount } from "svelte";
	let isIOS =
		(/iPad|iPhone|iPod/.test(navigator.platform) ||
			(navigator.platform === "MacIntel" &&
				navigator.maxTouchPoints > 1)) &&
		!(window as any).MSStream;

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
</script>

<ul>
	<StepSlide
		index={0}
		step={{ title: "Download your information from Instagram" }}
	>
		<p>Go to Instagram’s <strong>Download your information</strong> portal.</p>
        <button on:click={handleOpenInstagram}>{isIOS ? "Open" : "Go to"} Instagram</button>
	</StepSlide>
</ul>
