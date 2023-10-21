<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { ContentAction } from 'svelte-popperjs';
    import type { Modifier } from '@popperjs/core'
	import { fly } from 'svelte/transition';

	export let delay = 500;
	export let x = 0;
	export let y = 0;
	let className = '';
	export { className as class };

    type TModifier = $$Generic<Partial<Modifier<any, any>>>

	export let popperContent: ContentAction<TModifier>;
</script>

<div use:popperContent>
	<div
		on:mouseenter
		on:mouseleave
		in:fly|global={{
			x,
			y,
			delay
		}}
		class={cn(
			'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
			className
		)}
		role="tooltip"
	>
		<slot />
	</div>
</div>
