<script lang="ts">
	import { cn } from '$lib/utils';
	import { melt, type createTooltip } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';

	type Builder = ReturnType<typeof createTooltip>['elements']['content'];
	export let builder: Builder;

	let className: string | undefined = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
		className
	)}
    transition:fly={{
        x: 10
    }}
	use:melt={$builder}
>
	<slot />
</div>
