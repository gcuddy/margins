<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { receive, send } from '$lib/transitions';
	import { getContext } from 'svelte';
	import type { createTabs } from '@melt-ui/svelte';
	import mq from '$lib/stores/mq';
	import { derived } from 'svelte/store';

	type $$Props = TabsPrimitive.TriggerProps;
	type $$Events = TabsPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export { className as class };

	const {
		states: { value: stateValue },
	} = getContext('Tabs') as ReturnType<typeof createTabs>;

	$: selected = $stateValue === value;

    const duration = derived(mq, ($mq) => $mq.reducedMotion ? 0 : 200);
</script>

<TabsPrimitive.Trigger
	class={cn(
		'inline-flex items-center relative justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ',
		className,
		selected && 'text-foreground',
	)}
	{value}
	{...$$restProps}
	on:click
>
	{#if selected}
		<div
			out:send={{
                duration: $duration,
				key: 'indicator',
			}}
			in:receive={{
                duration: $duration,
				key: 'indicator',
			}}
			class="absolute inset-0 bg-background shadow-sm rounded-sm z-0"
		></div>
	{/if}
	<div class="z-10"><slot /></div>
</TabsPrimitive.Trigger>
