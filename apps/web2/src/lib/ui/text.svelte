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
		child,
		truncate,
		class: className,
		...rest
	}: Props & {
		child?: Snippet<[{ props: AttributeProps }]>;
	} = $props();

	const attributes = $derived({
		class: text({ className, size, highContrast, truncate }),
		'data-accent-color': color
	});
</script>

{#if child}
	{@render child({ props: attributes })}
{:else}
	<svelte:element this={as} {...attributes} {...rest}>
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
