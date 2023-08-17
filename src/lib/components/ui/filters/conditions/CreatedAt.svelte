<script lang="ts">
	import { cn } from '$lib/utils';
	import { melt } from '@melt-ui/svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { Select, SelectContent, SelectGroup, SelectItem } from '$components/ui/select';
	import type { CreatedAtFilter } from '$lib/schemas/library';
	import { formatDate } from '$lib/utils/date';
	import { Select as SelectPrimitive } from '@huntabyte/primitives';
	import Badge, { badgeVariants } from '../../Badge.svelte';

	export let filter: CreatedAtFilter;

	type TVal = 'gte' | 'lte' | 'equals';
	let val: TVal = 'gte' in filter ? 'gte' : 'lte' in filter ? 'lte' : 'equals';

	// let obj: { [key: TVal]: any };
	$: obj = {
		[val]: 'gte' in filter ? filter.gte : 'lte' in filter ? filter.lte : filter.equals
	};
	$: value = obj[val];
	$: isDate = value instanceof Date;
	// $: val = 'gte' in f ? 'gte' : 'lte' in f ? 'lte' : 'equals';

	const dispatch = createEventDispatcher<{
		change: CreatedAtFilter;
		delete: void;
	}>();
	$: dispatch('change', obj as CreatedAtFilter);

	const container = getContext('filterContainer') as Writable<HTMLDivElement | null>;
</script>

<div class="flex">
	<Badge variant="outline" class="rounded-r-none border-r-0">Saved</Badge>
	<Select
		portal={$container}
		positioning={{
			placement: 'bottom-start'
		}}
		bind:value={val}
	>
		<SelectPrimitive.Trigger let:builder asChild>
			<div
				use:melt={builder}
				class={cn(
					badgeVariants({
						variant: 'outline'
					}),
					'rounded-none'
				)}
			>
				{#if val === 'gte'}
					More than
				{:else if val === 'lte'}
					Less than
				{:else if val === 'equals'}
					Exactly
				{/if}
			</div>
		</SelectPrimitive.Trigger>
		<SelectContent>
			<SelectGroup>
				<SelectItem value="gte">More than</SelectItem>
				<SelectItem value="lte">Less than</SelectItem>
				{#if isDate}
					<SelectItem value="equals">Exactly</SelectItem>
				{/if}
			</SelectGroup>
		</SelectContent>
	</Select>
	<Badge variant="outline" class="rounded-none border-l-0">
		{#if value instanceof Date}
			{formatDate(value)}
		{:else if typeof value === 'object'}
			{value.num} {value.unit} ago
		{:else}
			{value}
		{/if}
	</Badge>
	<button
		on:click={() => {
			dispatch('delete');
		}}
		class={cn(badgeVariants({ variant: 'outline' }), 'rounded-l-none')}
	>
		x
	</button>
</div>
