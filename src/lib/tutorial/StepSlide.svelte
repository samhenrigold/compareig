<script lang="ts">
</script>

<li>
    <slot />
</li>

<style>
    li {
        display: flex;
        flex-direction: column;
        background: var(--secondary-bg);
        position: relative;
        padding: var(--space-m);
        padding-bottom: 0;
        border-radius: var(--space-xs);
        flex: 0 0 90%;
        scroll-snap-align: center;
    }

    li:first-of-type {
        scroll-snap-align: start;
    }

    li:last-of-type {
        scroll-snap-align: end;
    }

    li {
        & div {
            margin-bottom: var(--space-m);
        }

        & img {
            display: block;
            width: 100%;
            max-width: 30ch;
            height: auto;
            margin: auto;
            margin-bottom: 0;
        }

        & p {
            margin: 0;
            margin-bottom: var(--text--1);
            line-height: 1.25;
        }
    }

    li::before {
        margin: 0;
        padding: 0;
        content: counter(tutorial);
        counter-increment: tutorial;
        position: absolute;
        top: var(--space-2xs);
        left: var(--space-2xs);
        font-size: var(--text-7);
        font-weight: 900;
        pointer-events: none;
        line-height: 0.85;
        opacity: 0.15;
        mix-blend-mode: plus-darker;
    }

    @media (prefers-color-scheme: dark) {
        li::before {
            mix-blend-mode: plus-lighter;
        }
    }

    @media (min-width: 768px) {
        li {
            flex: 0 0 45%;
        }
    }
</style>
