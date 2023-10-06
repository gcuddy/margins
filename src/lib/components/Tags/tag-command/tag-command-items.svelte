<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import { PlusIcon } from 'lucide-svelte';

	import { Checkbox } from '$components/ui/checkbox';
	import * as Command from '$components/ui/command2';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { cn } from '$lib/utils';

	import { TagColorPill } from '../tag-color';
	import { derived } from 'svelte/store';

	type Tag = QueryOutput<'tags'>[number];
	type $$Props = {
		onCreate?: (name: string) => void;
		onSelect?: (tag: Tag) => void;
		selectedTags?: Array<Tag>;
		showCreate?: boolean;
	};

	export let selectedTags: Array<Tag> = [];
	export let onSelect: (tag: Tag) => void = () => {};
	export let onCreate: $$Props['onCreate'] = undefined;
	export let showCreate = true;

	const tags = createQuery(queryFactory.tags.list());

	$: console.log({ $tags });
	const {
		state: { inputValue, shouldFilter },
	} = Command.ctx.get();

	$: console.log({ $shouldFilter, $inputValue });

	// id -> number
	const scores = new Map<number, number>();

	const getId = (tag: Tag) => {
		return typeof tag === 'number' ? tag : tag.id;
	};

	function sortFunction(a: Tag, b: Tag) {
		const selected = selectedTags.find((t) => getId(t) === getId(a));
		const selected2 = selectedTags.find((t) => getId(t) === getId(b));
		if ($shouldFilter || !$inputValue) {
			if (selected && selected2) {
				return 0;
			} else if (selected) {
				return -1;
			} else if (selected2) {
				return 1;
			} else {
				return 0;
			}
		} else {
			// todo
			return 0;
		}
	}

	// let sortedTags = [...($tags.data ?? [])].sort(sortFunction);

	// $: if (!open) {
	// 	sortedTags = [...($tags.data ?? [])].sort(sortFunction);
	// }

	const tagsData = derived(
		[tags, inputValue, shouldFilter],
		([$tags, $inputValue, $shouldFilter]) => {
			const sortedTags = [...($tags.data ?? [])].sort(sortFunction);

			if ($shouldFilter) {
				return sortedTags;
			}

			const filteredTags = sortedTags
				.filter((tag) => {
					if ($shouldFilter) {
						return true;
					}
					const score = commandScore(tag.name, $inputValue);
					scores.set(tag.id, score);
					if (score > 0) {
						return true;
					}
					return false;
				})
				.sort((a, b) => {
					if ($shouldFilter) {
						return 0;
					}
					return (scores.get(getId(b)) ?? 0) - (scores.get(getId(a)) ?? 0);
				});
			return filteredTags;
		},
	);
</script>

{#if $tags.isLoading}
	<Command.Loading>Loading...</Command.Loading>
{:else if $tags.isSuccess}
	{#each $tagsData as tag (tag.id)}
		<Command.Item
			class="group"
			value={tag}
			let:isSelected
			onSelect={() => onSelect(tag)}
		>
			<Checkbox
				class={cn(
					'mr-2 opacity-0 cursor-default group-data-[highlighted]:opacity-100',
					isSelected && 'opacity-100',
				)}
				checked={isSelected}
			/>
			<TagColorPill color={tag.color} class="h-2 w-2 mr-2" />
			<span> {tag.name}</span>
		</Command.Item>
	{/each}
	{#if showCreate && $inputValue.length > 1 && $tagsData.every(({ name }) => name !== $inputValue)}
		<Command.Item
			alwaysShow={true}
			shouldRegister={false}
			id="shadow-new-tag"
			value={{ name: $inputValue }}
			let:isSelected
			onSelect={() => {
				onCreate?.($inputValue);
			}}
		>
			<PlusIcon class="mr-2 opacity-50 h-4 w-4" />
			<span class="inline-flex grow items-center">
				<span>New tag: </span>
				<span class="font-medium text-muted-foreground">"{$inputValue}"</span>
			</span>
		</Command.Item>
	{/if}
{/if}
