<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import { type createContextMenu, melt } from '@melt-ui/svelte';

	type ContextMenu = ReturnType<typeof createContextMenu>;
	let className = '';
	export { className as class };
	export let menu: ContextMenu['elements']['menu'];

</script>

<div
	{...$$restProps}
	class={cn(
		'z-50 min-w-[8rem] rounded-md border bg-popover/90 backdrop-blur-sm p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)}
	use:melt={$menu}
>
	<slot />
</div>
