<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import {
		MoreHorizontalIcon,
		PaintbrushIcon,
		XCircleIcon,
	} from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';

	import { invalidate } from '$app/navigation';
	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { mutate, type MutationInput } from '$lib/queries/query';

	import type { PageData } from './$types';
	import CollectionItemCard from './collection-item-card.svelte';

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

	export let item: PageData['collection']['items'][number];

	let customizeDialogOpen = false;

	let width =
		(item.width as ComponentProps<CollectionItemCard>['width']) ?? 'default';

	export let shouldTransition = false;
</script>

<CollectionItemCard bind:width {item} {shouldTransition}>
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
				</DropdownMenu.Item></DropdownMenu.Group
			>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
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
			<CollectionItemCard shouldTransition={false} {width} {item} />
			<div>
				<!-- TODO: colors -->
				<!-- TODO: font -->
				<!-- TODO: width, and add note -->
				Size:
				<select bind:value={width}>
					<option value="default">Default</option>
					<option value="wide">Wide</option>
				</select>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
