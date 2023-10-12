<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import debounce from 'just-debounce-it';
	import { writable } from 'svelte/store';

	import { TagColorPill } from '$components/tags/tag-color';
	import { badgeVariants } from '$components/ui/badge';
	import { Checkbox } from '$components/ui/checkbox';
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from '$components/ui/popover';
	import {
		Command,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from '$lib/components/ui/command2';
	import { queryFactory } from '$lib/queries/querykeys';
	import {
		logicalOperators,
		type FilterLibrarySchema,
		type LogicalOperator,
	} from '$lib/schemas/library';
	import { cn } from '$lib/utils';

	import { ctx } from '../ctx';
	import ConditionLayout from '../helpers/ConditionLayout.svelte';
	import Select from '../helpers/Select.svelte';
	import type { ComboboxOption } from '$components/ui/command2/store';
	import { comparatorToDisplay } from '$lib/schemas/inputs/comparators';

	export let ids: Array<number>;
	export let type: NonNullable<
		NonNullable<FilterLibrarySchema['tags']>['type']
	> = 'and';

	if (type === undefined) {
		type = 'or';
	}

	const tag = createQuery({
		...queryFactory.tags.list(),
		// select: (data) => {
		// 	return data.filter((tag) => ids.includes(tag.id));
		// }
	});

	type Tag = { color: string; id: number; name: string };

	const chosenTags = writable<Array<ComboboxOption<Tag>>>([]);

	$: $chosenTags = ($tag.data?.filter((tag) => ids.includes(tag.id)) ?? []).map(
		(tag) => ({
			label: tag.name,
			value: tag,
		}),
	);

	const {
		helpers: { navigateSearch },
		state: { filterStore },
	} = ctx.get();

	export let popoverOpen = false;

	function sortFunction(a: Tag, b: Tag) {
		const selected = $chosenTags.find((t) => t.value.id === a.id);
		const selected2 = $chosenTags.find((t) => t.value.id === b.id);
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
					ids: $chosenTags.map((tag) => tag.value.id),
					type,
				};
				return data;
			});
		},
		1000,
		true,
	);

	const logicalOperatorToDisplay: Record<LogicalOperator, string> = {
		and: 'all of',
		or: 'any of',
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
			selected={{
				value: type,
			}}
			choices={logicalOperators.map((operator) => ({
				label: `include ${logicalOperatorToDisplay[operator]}`,
				value: operator,
			}))}
			onSelectedChange={({value}) => {
                console.log({value})
				type = value;
				navigateSearch((data) => {
                    console.log({data});
                    data.tags = {
                        ids: $chosenTags.map((tag) => tag.value.id),
                        type,
                    };
                    return data;
                });
			}}
		>
			{#if $chosenTags.length === 1 && $chosenTags[0]}
				include
			{:else}
				include {logicalOperatorToDisplay[type || 'or']}
			{/if}
		</Select>

		<Popover bind:open={popoverOpen}>
			<PopoverTrigger asChild let:builder>
				<div
					use:melt={builder}
					class={cn(
						badgeVariants({ variant: 'outline' }),
						'rounded-none border-x-0 flex gap-x-2',
					)}
				>
					{#if $chosenTags.length === 1 && $chosenTags[0]}
						<TagColorPill
							class="h-2 w-2 mr-2"
							color={$chosenTags[0].value.color}
						/>
						{$chosenTags[0].value.name}
					{:else if $chosenTags.length > 1}
						<div class="flex items-center -space-x-1">
							{#each $chosenTags.slice(0, 3) as tag}
								<TagColorPill
									class="h-3 w-3 border border-background"
									color={tag.value.color}
								/>
							{/each}
						</div>
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
