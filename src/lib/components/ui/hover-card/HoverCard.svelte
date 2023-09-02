<script lang="ts">
	import {
		HoverCard,
		type HoverCardContentProps,
		type HoverCardRootProps,
	} from 'radix-svelte';
	import type { ComponentProps } from 'svelte';

	import { cn } from '$lib/utils/tailwind';
	let className = '';
	export { className as class };

	export let root: HoverCardRootProps | undefined = undefined;
	export let content: HoverCardContentProps = {
		align: 'center',
		sideOffset: 4,
	};
</script>

<HoverCard.Root openDelay={300}>
	<HoverCard.Trigger>
		<slot name="trigger" />
	</HoverCard.Trigger>
	<HoverCard.Portal>
		<HoverCard.Content
			{...content}
			class={cn(
				'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in zoom-in-90',
				className,
			)}
		>
			<slot name="content" />
		</HoverCard.Content>
	</HoverCard.Portal>
</HoverCard.Root>
