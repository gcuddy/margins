<script lang="ts">
	import { cn } from '$lib/utils';
	import { ctx } from './ctx';
	import type { RootProps } from './types';

	export let value: string | undefined = undefined;
	const {
		state: { selectedValue }
	} = ctx.set({
		defaultSelectedValue: value ? [value] : []
	});

	$: value = $selectedValue[0];

	type $$Props = RootProps;

	export let asChild = false;
	export let unstyled = false;
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

{#if asChild}
	<slot />
{:else}
	<div
		class={cn(
			!unstyled &&
				'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
			className
		)}
	>
		<slot />
	</div>
{/if}
