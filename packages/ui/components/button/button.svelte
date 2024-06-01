<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { cn } from '@margins/lib';
	import { buttonVariants, type Props, type Events } from './index.js';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'solid';
	export let size: $$Props['size'] = 'md';
	export let builders: $$Props['builders'] = [];
	export let color: $$Props['color'] = undefined;
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(
		buttonVariants({ color: color ?? undefined, className, size, variant }),
	)}
	data-variant={variant}
	data-size={size}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot>Button</slot>
</ButtonPrimitive.Root>

<style>
	:global(:root) {
		--base-button-classic-after-inset: 2px;
		--base-button-classic-box-shadow-top: inset 0 0 0 1px var(--gray-a4),
			inset 0 -2px 1px var(--gray-a3);
		--base-button-classic-box-shadow-bottom: inset 0 4px 2px -2px var(--white-a9),
			inset 0 2px 1px -1px var(--white-a9);
		--base-button-classic-disabled-box-shadow: var(
				--base-button-classic-box-shadow-top
			),
			var(--base-button-classic-box-shadow-bottom);
		--base-button-classic-active-filter: brightness(0.92) saturate(1.1);
		--base-button-classic-high-contrast-hover-filter: contrast(0.88)
			saturate(1.1) brightness(1.1);
		--base-button-classic-high-contrast-active-filter: contrast(0.82)
			saturate(1.2) brightness(1.16);
	}
	/* prettier-ignore */
	:global(:is(.dark, .dark-theme)) {
  --base-button-classic-after-inset: 1px;
  --base-button-classic-box-shadow-top:
    inset 0 0 0 1px var(--white-a2),
    inset 0 4px 2px -2px var(--white-a3),
    inset 0 1px 1px var(--white-a6),
    inset 0 -1px 1px var(--black-a6);
  --base-button-classic-box-shadow-bottom: 0 0 transparent;
  --base-button-classic-disabled-box-shadow:
    inset 0 0 0 1px var(--gray-a5),
    inset 0 4px 2px -2px var(--gray-a2),
    inset 0 1px 1px var(--gray-a5),
    inset 0 -1px 1px var(--black-a3),
    inset 0 0 0 1px var(--gray-a2);
  --base-button-classic-active-filter: brightness(1.08);
  --base-button-classic-high-contrast-hover-filter: contrast(0.88) saturate(1.3) brightness(1.14);
  --base-button-classic-high-contrast-active-filter: brightness(0.95) saturate(1.2);
}

	:global([data-button-root][data-variant='classic']) {
		background-image: linear-gradient(to bottom, #0000 50%, var(--sand-a4)),
			linear-gradient(to bottom, #0000 50%, var(--accent-9) 80%);
		box-shadow:
			var(--base-button-classic-box-shadow-top),
			inset 0 0 0 1px var(--accent-9),
			var(--base-button-classic-box-shadow-bottom);

		&::after {
			content: '';
			position: absolute;
			border-radius: inherit;
			pointer-events: none;
			inset: 0;
			z-index: -1;
			border: var(--base-button-classic-after-inset) solid transparent;
			background-clip: content-box;
			background-color: inherit;
			background-image: linear-gradient(
				var(--black-a1),
				transparent,
				var(--white-a2)
			);
			box-shadow: inset 0 2px 3px -1px var(--white-a4);
		}
		&:where(:hover) {
			&::after {
				background-color: var(--accent-10);
				background-image: linear-gradient(
					var(--black-a2) -15%,
					transparent,
					var(--white-a3)
				);
			}
			&:where(.rt-high-contrast) {
				filter: var(--base-button-classic-high-contrast-hover-filter);
				&::after {
					background-color: var(--accent-12);
					background-image: linear-gradient(
						var(--black-a5),
						transparent,
						var(--white-a2)
					);
				}
			}
		}
		&:where(:active:not([data-state='open'], [data-disabled])) {
			background-color: var(--accent-9);
			background-image: linear-gradient(var(--black-a1), transparent);
			padding-top: var(--base-button-classic-active-padding-top);

			/* prettier-ignore */
			box-shadow:
      inset 0 4px 2px -2px var(--gray-a4),
      inset 0 1px 1px var(--gray-a7),
      inset 0 0 0 1px var(--gray-a5),
      inset 0 0 0 1px var(--accent-9),
      inset 0 3px 2px var(--gray-a3),
      inset 0 0 0 1px var(--white-a7),
      inset 0 -2px 1px var(--white-a5);

			&::after {
				box-shadow: none;
				background-color: inherit;
				background-image: linear-gradient(
					var(--black-a2),
					transparent,
					var(--white-a3)
				);
			}
		}
	}
</style>
