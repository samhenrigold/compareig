<script lang="ts">
    import type { TutorialStep } from "@/types/tutorial";
    export let step: TutorialStep;
    export let index: number;
</script>

<li>
    <h2>{index} {step.title}</h2>
    {#if step.description}
        <p>{step.description}</p>
    {/if}
    <slot />
</li>