<script lang="ts">
	import type { Props } from './text.props';
	import { text } from './text.props';

	let { children, as = 'span', size, color, highContrast }: Props = $props();
</script>

<svelte:element
	this={as}
	class:rt-high-contrast={highContrast}
	class={text({ class: 'rt-Text', size })}
	data-accent-color={color}
>
	{@render children()}
</svelte:element>

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
