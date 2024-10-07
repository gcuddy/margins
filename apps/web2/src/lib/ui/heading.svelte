<script lang="ts">
	import { heading, type Props } from './heading.props';

	let { children, as = 'h1', color, highContrast, size, class: className }: Props = $props();
</script>

<svelte:element
	this={as}
	class:rt-high-contrast={highContrast}
	class={heading({ className: ['rt-Heading', className], size })}
	data-accent-color={color}
>
	{@render children()}
</svelte:element>

<style>
	.rt-Heading {
		--leading-trim-start: var(--heading-leading-trim-start);
		--leading-trim-end: var(--heading-leading-trim-end);

		:where(&) {
			margin: 0;
		}

		&:where([data-accent-color]) {
			color: var(--accent-a11);
		}

		&:where([data-accent-color].rt-high-contrast) {
			color: var(--accent-12);
		}
	}
</style>
