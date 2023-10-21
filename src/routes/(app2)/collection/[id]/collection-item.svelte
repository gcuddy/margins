<script lang="ts">
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import {
		MoreHorizontalIcon,
		PaintbrushIcon,
		PlusCircle,
		XCircleIcon,
	} from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
	import { derived } from 'svelte/store';

	import { invalidate } from '$app/navigation';
	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { initBookmarkCreateMutation } from '$lib/queries/mutations';
	import { mutate, type MutationInput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';

	import type { PageData } from './$types';
	import CollectionItemCard from './collection-item-card.svelte';
	import {
		type CollectionItemWidth,
		collectionItemWidths,
	} from '$lib/schemas/inputs/collection.schema';
	import { capitalize, cn } from '$lib/utils';

	export let item: PageData['collection']['items'][number];
	let className: string | undefined = undefined;
	export { className as class };

	const bookmarkCreateMutation = initBookmarkCreateMutation();

	const removeFromCollectionMutation = createMutation({
		mutationFn: async (
			input: Omit<MutationInput<'removeFromCollection'>, 'collectionId'>,
		) =>
			mutate('removeFromCollection', {
				collectionId: item.collectionId,
				...input,
			}),
		onSuccess() {
			invalidate('collection');
		},
	});

	const updateCollectionItemMutation = createMutation({
		mutationFn: (data: MutationInput<'updateCollectionItem'>['data']) =>
			mutate('updateCollectionItem', {
				data,
				id: item.id,
			}),
	});

	const entriesQuery = createQuery(queryFactory.entries.all());

	const inLibrary = derived(entriesQuery, ($entriesQuery) => {
		if (!$entriesQuery.data) {
			return false;
		}

		return $entriesQuery.data.some((entry) => entry.id === item.entry?.id);
	});



	let customizeDialogOpen = false;

	let width = (item.width as CollectionItemWidth) ?? 'default';
	// let style = 'default';
</script>

<CollectionItemCard class={cn(
    "hover:ring-2",
    $inLibrary ? 'ring-blue-400 hover:ring' : 'ring-ring',
    className
)} bind:width {item}>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				size="icon"
				variant="secondary"
				class="absolute opacity-0 group-hover:opacity-100  transition-opacity duration-100 data-[state=open]:opacity-100 right-2 bottom-2 px-2 h-8 w-8"
			>
				<MoreHorizontalIcon class="h-4 w-4" />
				<span class="sr-only">Menu</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.Item
					on:click={() => {
						customizeDialogOpen = true;
					}}
				>
					<PaintbrushIcon class="h-4 w-4 mr-2" />
					Customize style
				</DropdownMenu.Item>
				{#if item.entry?.id || item.annotation?.id}
					{@const entryId = item.entry?.id}
					{@const annotationId = item.annotation?.id}
					<DropdownMenu.Item
						on:click={() => {
							$removeFromCollectionMutation.mutate({
								annotationId,
								entryId,
							});
						}}
					>
						<XCircleIcon class="h-4 w-4 mr-2" />
						Remove from collection
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Group>
			{#if !$inLibrary}
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					{#if !$inLibrary && item.entry?.id}
						{@const entryId = item.entry?.id}
						<DropdownMenu.Item
							on:click={() => {
								$bookmarkCreateMutation.mutate({
									entryId,
								});
							}}
						>
							<PlusCircle class="h-4 w-4 mr-2" />
							Save to library
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Group>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</CollectionItemCard>

<Dialog.Root
	bind:open={customizeDialogOpen}
	onOpenChange={(e) => {
		if (!e) {
			if (width !== item.width) {
				if ($updateCollectionItemMutation.isPending) {
					return;
				}
				$updateCollectionItemMutation.mutate({
					width,
				});
				item.width = width;
			}
		}
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Customize card</Dialog.Title>
		</Dialog.Header>
		<div class="flex divide-x">
			<CollectionItemCard {width} {item} />
			<div>
				<!-- TODO: colors -->
				<!-- TODO: font -->
				<!-- TODO: width, and add note -->
				Size:
				<select bind:value={width}>
					{#each collectionItemWidths as width}
						<option value={width}>{capitalize(width)}</option>
					{/each}
				</select>
				<!-- <div>
                    Style:
                    <select bind:value={style}>
                        <option value="default">Default</option>
                        <option value="full">Poster</option>
                    </select>
                </div> -->
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
