<script lang="ts">
	import { Popover as PopoverPrimitive } from 'bits-ui';
	import { cn } from '@margins/lib';
	import { fade } from 'svelte/transition';
	import { popoverVariants } from './index.js';

	type $$Props = Omit<PopoverPrimitive.ContentProps, 'transition'>;

	let className: $$Props['class'] = undefined;
	// export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 100,
	};
	export let align: $$Props['align'] = 'start';
	export let sideOffset: $$Props['sideOffset'] = 8;
	export { className as class };
</script>

<PopoverPrimitive.Content
	{align}
	{sideOffset}
	{...$$restProps}
	class={cn(popoverVariants({}), className)}
>
	<slot />
</PopoverPrimitive.Content>
