<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { cn } from '@margins/lib';

	type $$Props = Omit<DropdownMenuPrimitive.ContentProps, 'transition'>;

	let className: $$Props['class'] = undefined;
	export let sideOffset: $$Props['sideOffset'] = 4;
	// export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 75,
	};
	export { className as class };
</script>

<DropdownMenuPrimitive.Content
	outTransition={fade}
	outTransitionConfig={transitionConfig}
	{sideOffset}
	class={cn(
		'bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-lg border p-1 shadow-md focus:outline-none',
		className,
	)}
	{...$$restProps}
	on:keydown
>
	<slot />
</DropdownMenuPrimitive.Content>
