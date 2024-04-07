<script lang="ts">
	import { Popover as PopoverPrimitive } from 'bits-ui';
	import { cn } from '@margins/lib';
	import { fade } from 'svelte/transition';

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
	class={cn(
		'bg-popover text-popover-foreground z-50 w-72 rounded-lg border p-4 shadow-md outline-none',
		className,
	)}
>
	<slot />
</PopoverPrimitive.Content>
