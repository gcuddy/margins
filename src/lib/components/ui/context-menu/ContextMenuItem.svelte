<script lang="ts" context="module">
	export const contextMenuItem = cva(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		{
			variants: {
				inset: {
					true: 'pl-8'
				}
			},
			defaultVariants: {
				inset: false
			}
		}
	);
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import { melt, type createContextMenu } from '@melt-ui/svelte';
	import { createContextMenuItemContext } from './utils';
	import { cva } from 'class-variance-authority';
	type C = ReturnType<typeof createContextMenu>;

	let className = '';
	export { className as class };

	export let item: C['elements']['item'];

	export let inset = false;
	export let onSelect: ((e: Event) => void) | undefined = undefined;

	const options = createContextMenuItemContext({ inset });

	$: options.update((o) => ({ ...o, inset }));
</script>

<div
	use:melt={$item}
    on:m-click={(e) => {
        onSelect?.(e);
    }}
	class={cn(
		contextMenuItem({
			inset: $options.inset
		}),
		className
	)}
>
	<slot />
</div>
