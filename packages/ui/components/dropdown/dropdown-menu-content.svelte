<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { dropdownContent } from './index.js';
	import type { VariantProps } from 'tailwind-variants';
	import { flyAndScale } from '@margins/lib';
	import { getContext } from 'svelte';

	type $$Props = Omit<DropdownMenuPrimitive.ContentProps, 'transition'> &
		VariantProps<typeof dropdownContent>;

	let className: $$Props['class'] = undefined;
	export let sideOffset: $$Props['sideOffset'] = 4;
	// export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 160,
	};
	export let size: $$Props['size'] = 'md';
	export let color: $$Props['color'] = 'gold';
	export { className as class };
</script>

<DropdownMenuPrimitive.Content
	outTransition={flyAndScale}
	{transitionConfig}
	{sideOffset}
	data-size={size}
	class={dropdownContent({ color, className, size })}
	{...$$restProps}
	on:keydown
>
	<slot />
</DropdownMenuPrimitive.Content>
