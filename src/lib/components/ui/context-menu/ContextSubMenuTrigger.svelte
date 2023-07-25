<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { createContextMenu } from '@melt-ui/svelte';
	import { ChevronRight } from 'lucide-svelte';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	type SubTrigger = ReturnType<ReturnType<typeof createContextMenu>['createSubMenu']>['subTrigger'];

	let className: string | null | undefined = '';
	export { className as class };

	type $$Props = HTMLBaseAttributes & {
		inset?: boolean;
		subTrigger: SubTrigger;
	};

	export let inset = false;

	export let subTrigger: SubTrigger;
</script>

<div
	melt={$subTrigger}
	class={cn(
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
		inset && 'pl-8',
		className
	)}
>
	<slot />
	<ChevronRight class="ml-auto h-4 w-4" />
</div>
