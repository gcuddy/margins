<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AttributeProps, Props } from './text.props';
	import { text } from './text.props';

	let {
		children,
		as = 'span',
		size,
		color,
		highContrast,
		child
	}: Props & {
		child?: Snippet<[{ props: AttributeProps }]>;
	} = $props();

	const className = $derived(text({ class: 'rt-Text', size, highContrast }));
</script>

{#if child}
	{@render child({ props: { class: className, 'data-accent-color': color } })}
{:else}
	<svelte:element this={as} class={className} data-accent-color={color}>
		{@render children?.()}
	</svelte:element>
{/if}

<style>
	.rt-Text {
		:where(&) {
			margin: 0;
		}

		&:where([data-accent-color]) {
			color: var(--accent-a11);
		}

		&:where([data-accent-color].rt-high-contrast) {
			color: var(--accent-12);
		}

		/* stylelint-disable selector-max-type */
		&:where(label) {
			/* Better -webkit-tap-highlight-color */
			@media (pointer: coarse) {
				-webkit-tap-highlight-color: transparent;
				&:where(:active) {
					outline: 0.75em solid var(--gray-a4);
					outline-offset: -0.6em;
				}
			}
		}
	}
</style>
