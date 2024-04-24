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
	export let align: $$Props['align'] = 'center';
	export let sideOffset: $$Props['sideOffset'] = 4;
	export { className as class };
</script>

<PopoverPrimitive.Content
	outTransition={fade}
	outTransitionConfig={{
		...transitionConfig,
		duration: 100,
	}}
	{align}
	{sideOffset}
	{...$$restProps}
	class={cn(popoverVariants({}), className)}
>
	<slot />
</PopoverPrimitive.Content>
