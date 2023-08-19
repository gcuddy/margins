<script lang="ts">
	import Badge, { badgeVariants } from '$components/ui/Badge.svelte';
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';
	import ConditionLayout from '../helpers/ConditionLayout.svelte';
	import Select from '../helpers/Select.svelte';
	import {
		logicalOperators,
		type FilterLibrarySchema,
		LogicalOperator
	} from '$lib/schemas/library';
	import { ctx } from '../ctx';
	import { writable } from 'svelte/store';
	import { cn } from '$lib/utils';

	import {
		Command,
		CommandInput,
		CommandItem,
		CommandItems,
		CommandList,
		CommandGroup,
		CommandEmpty,
		CommandSeparator,
		CommandShortcut
	} from '$lib/components/ui/command2';
	import { Popover, PopoverContent, PopoverTrigger } from '$components/ui/popover';
	import { melt } from '@melt-ui/svelte';
	import { Checkbox } from '$components/ui/checkbox';
	import { onDestroy } from 'svelte';
	import debounce from 'just-debounce-it';
	import { includes } from 'lodash';

	export let ids: number[];
	export let type: NonNullable<NonNullable<FilterLibrarySchema['tags']>['type']> = 'and';

	const tag = createQuery({
		...queryFactory.tags.list()
		// select: (data) => {
		// 	return data.filter((tag) => ids.includes(tag.id));
		// }
	});

	type Tag = { id: number; name: string };

	const chosenTags = writable<Tag[]>([]);

	$: $chosenTags = $tag.data?.filter((tag) => ids.includes(tag.id)) ?? [];

	const {
		state: { filterStore }
	} = ctx.get();

	export let popoverOpen = false;

	function sortFunction(a: Tag, b: Tag) {
		const selected = $chosenTags.find((t) => t.id === a.id);
		const selected2 = $chosenTags.find((t) => t.id === b.id);
		if (selected && selected2) {
			return 0;
		} else if (selected) {
			return -1;
		} else if (selected2) {
			return 1;
		} else {
			return 0;
		}
	}

	let sortedTags = [...($tag.data ?? [])].sort(sortFunction);

	$: if (!popoverOpen) {
		sortedTags = [...($tag.data ?? [])].sort(sortFunction);
	}

	const debouncedSetData = debounce(
		() => {
			filterStore.change((data) => {
				if (!$chosenTags.length) {
					delete data.tags;
					return data;
				}
				data.tags = {
					type,
					ids: $chosenTags.map((tag) => tag.id)
				};
				return data;
			});
		},
		1000,
		true
	);

	const logicalOperatorToDisplay: Record<LogicalOperator, string> = {
		and: 'all of',
		or: 'any of'
	};
</script>

{#if $tag.data}
	<!-- <Badge>
		{$tag.data.name}
	</Badge> -->
	<ConditionLayout
		name="Tags"
		on:delete={() => {
			filterStore.change((data) => {
				delete data.tags;
				return data;
			});
		}}
	>
		<Select
			bind:value={type}
			choices={logicalOperators.map((operator) => ({
				name: logicalOperatorToDisplay[operator],
				value: operator
			}))}
			onValueChange={(value) => {
				type = value;
				debouncedSetData();
			}}
		>
			{#if $chosenTags.length === 1 && $chosenTags[0]}
				include
			{:else}
				include {logicalOperatorToDisplay[type]}
			{/if}
		</Select>

		<Popover bind:open={popoverOpen}>
			<PopoverTrigger asChild let:builder>
				<div
					use:melt={builder}
					class={cn(badgeVariants({ variant: 'outline' }), 'rounded-none border-x-0')}
				>
					{#if $chosenTags.length === 1 && $chosenTags[0]}
						{$chosenTags[0].name}
					{:else}
						{$chosenTags.length} tags
					{/if}
					<!--  -->
				</div>
			</PopoverTrigger>
			<PopoverContent class="w-[200px] p-0">
				<Command
					onClose={() => {
						popoverOpen = false;
					}}
					selectedValue={chosenTags}
					valueToString={(tag) => tag.name}
					multiple
				>
					<CommandInput />
					<CommandList>
						<CommandGroup>
							{#each sortedTags as tag}
								<CommandItem
									value={tag}
									cancelClose="[data-melt-checkbox], svg"
									let:isSelected
									onSelect={debouncedSetData}
								>
									<Checkbox class="mr-2" checked={isSelected} />
									<span>{tag.name}</span>
								</CommandItem>
							{/each}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>

		<!-- TODO: combobox here -->
	</ConditionLayout>
{/if}
