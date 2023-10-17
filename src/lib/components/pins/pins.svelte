<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Box, Layers, XIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { page } from '$app/stores';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { Icon } from '$components/icon-picker';
	import { TagColorPill } from '$components/tags/tag-color';
	import { Button }  from '$components/ui/button';
	import { nanoid } from '$lib/nanoid';
	import {
		initCreatePinMutation,
		initDeletePinMutation,
	} from '$lib/queries/mutations';
	import { mutate, type MutationInput } from '$lib/queries/query';
	import type { Pin } from '$lib/queries/server';
	import { cn } from '$lib/utils';
	import { make_link } from '$lib/utils/entries';

	import PinFolder from './pin-folder.svelte';
	export let pins: Array<
		Pin & {
			pending?: boolean;
		}
	>;

	export let size: 'default' | 'sm' | 'lg' = 'default';
	export let type: string | undefined = undefined;

	const queryClient = useQueryClient();

	let className = '';
	export { className as class };

	const updatePinMutation = createMutation({
		mutationFn: (input: MutationInput<'updateFavorite'>) =>
			mutate('updateFavorite', input),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ['pins'],
			}),
	});

	const deletePinMutation = initDeletePinMutation();

	const createPinMutation = initCreatePinMutation();

	function updateQueryData() {
		queryClient.setQueryData<Array<Pin>>(['pins', 'list'], (data) => {
			if (!data) {
				return data;
			}
			return pins;
		});
	}

	export let root = false;
	export let parentId: string | null = null;

	const foldersOpen: Record<string, boolean> = {};

	const dispatch = createEventDispatcher();

	export const addFolder = () =>
		(pins = [
			{
				children: [],
				collection: null,
				createdAt: new Date(),
				entry: null,
				folderName: '',
				id: nanoid(),
				note: null,
				parentId: null,
				pending: true,
				sortOrder: (pins[0]?.sortOrder ?? 1) - 1,
				tag: null,
				type: 'FOLDER',
				updatedAt: new Date(),
				view: null,
			},
			...pins,
		]);
</script>

<div
	class={className}
	use:dndzone={{
		flipDurationMs: 200,
		items: pins,
		type,
	}}
	on:consider={(e) => {
		pins = e.detail.items;

		// open a folder if we're hovering over it
		if (e.detail.info.trigger === 'draggedOverIndex') {
			const { id } = e.detail.info;
			const index = pins.findIndex((p) => p.id === id);
			// if index is within 1 of folder, open folder
			if (index > 0 && pins[index - 1]?.type === 'FOLDER') {
				const pin = pins[index - 1];
				if (pin) {
					foldersOpen[pin.id] = true;
				}
			} else if (
				index < pins.length - 1 &&
				pins[index + 1]?.type === 'FOLDER'
			) {
				const pin = pins[index + 1];
				if (pin) {
					foldersOpen[pin.id] = true;
				}
			}
		}
	}}
	on:finalize={(e) => {
		pins = e.detail.items;
		const id = e.detail.info.id;
		const index = pins.findIndex((i) => i.id === id);
		let newSortOrder = 0;
		if (index === 0) {
			newSortOrder = (pins[1]?.sortOrder ?? 0) - 1;
		} else if (index === pins.length - 1) {
			newSortOrder = (pins[index - 1]?.sortOrder ?? 0) + 1;
		} else {
			newSortOrder =
				((pins[index - 1]?.sortOrder ?? 0) +
					(pins[index + 1]?.sortOrder ?? 0)) /
				2;
		}

		const pin = pins[index];

		// console.log({ pin });

		// Should not be the case
		if (!pin) {
			return;
		}

		pin.sortOrder = newSortOrder;
		pin.parentId = parentId;
		pins = pins;
		// console.log({ id, index, newSortOrder, parentId, pin, root });

		if (root) {
			updateQueryData();
			$updatePinMutation.mutate({
				data: {
					parentId,
					sortOrder: newSortOrder,
				},
				id: pin.id,
			});
		} else {
			dispatch('update');
			$updatePinMutation.mutate({
				data: {
					parentId,
					sortOrder: newSortOrder,
				},
				id: pin.id,
			});
		}
	}}
>
	{#each pins as pin (pin.id)}
		<div
			animate:flip={{
				duration: 200,
			}}
		>
			{#if pin.type === 'FOLDER'}
				<PinFolder
					{size}
					disableMutations={$deletePinMutation.isPending ||
						$createPinMutation.isPending}
					on:delete={() => {
						$deletePinMutation.mutate({
							id: pin.id,
						});
					}}
					onBlur={(pin) => {
						// console.log({ pin });
						if (pin.pending && !pin.folderName) {
							pins = pins.filter((p) => p.id !== pin.id);
							return;
						} else if (pin.pending) {
							// create folder
							// console.log({ pin });
							$createPinMutation.mutate({
								folderName: pin.folderName,
								id: pin.id,
								sortOrder: pin.sortOrder,
							});
						} else {
							$updatePinMutation.mutate({
								data: {
									folderName: pin.folderName,
								},
								id: pin.id,
							});
						}
						pin.pending = false;
					}}
					renaming={pin.pending}
					on:update={updateQueryData}
					open={foldersOpen[pin.id]}
					{pin}
				/>
				<!-- <{cn(Button {size} variant="ghost" class="w-full justify-start font-normal"}, size !== 'sm' && 'text-base')>
					<Folder class="mr-2 h-4 w-4 shrink-0" />
					{pin.folderName}
				</Button> -->
			{:else if pin.view}
				{@const href = `/views/${pin.view.id}`}
				<Button
					{size}
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class={cn(
						'w-full justify-start font-normal',
						// size !== 'sm' && 'text-base',
					)}
					{href}
					on:click={(e) => {
						if (
							e.target instanceof HTMLButtonElement &&
							e.target !== e.currentTarget
						) {
							e.preventDefault();
						}
					}}
				>
					<Layers class="mr-2 h-4 w-4 shrink-0" />
					<span class="truncate grow">{pin.view.name}</span>
					<button
						on:click|stopPropagation|preventDefault={() => {
							{
								$deletePinMutation.mutate({
									id: pin.id,
								});
							}
						}}
						class={cn(
							'opacity-0 group-hover:opacity-100 transition-opacity',
							size !== 'sm' && 'opacity-50',
						)}
					>
						<XIcon class="h-3 w-3 shrink-0 ml-auto" />
					</button>
				</Button>
			{:else if pin.collection}
				{@const href = `/collection/${pin.collection.id}`}
				<Button
					{size}
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class={cn(
						'w-full justify-start font-normal group',
						// size !== 'sm' && 'text-base',
					)}
					{href}
					on:click={(e) => {
						if (
							e.target instanceof HTMLButtonElement &&
							e.target !== e.currentTarget
						) {
							e.preventDefault();
						}
					}}
				>
					<Box class="mr-2 h-4 w-4 shrink-0" />
					<span class="truncate grow"> {pin.collection.name}</span>
					<button
						on:click|stopPropagation|preventDefault={() => {
							{
								$deletePinMutation.mutate({
									id: pin.id,
								});
							}
						}}
						class={cn(
							'opacity-0 group-hover:opacity-100 transition-opacity',
							size !== 'sm' && 'opacity-50',
						)}
					>
						<XIcon class="h-3 w-3 shrink-0 ml-auto" />
					</button>
				</Button>
			{:else if pin.tag}
				{@const href = `/tag/${pin.tag.name}`}
				<Button
					{size}
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class={cn(
						'w-full justify-start font-normal group',
						// size !== 'sm' && 'text-base',
					)}
					{href}
					on:click={(e) => {
						if (
							e.target instanceof HTMLButtonElement &&
							e.target !== e.currentTarget
						) {
							e.preventDefault();
						}
					}}
				>
					<!-- <Tag class="mr-2 h-4 w-4 shrink-0" /> -->
					<div class="h-4 w-4 mr-2 shrink-0 flex items-center justify-center">
						<TagColorPill color={pin.tag.color} class="h-2 w-2" />
					</div>
					<span class="truncate grow"> {pin.tag.name}</span>
					<button
						on:click={() => {
							{
								$deletePinMutation.mutate({
									id: pin.id,
								});
							}
						}}
						class={cn(
							'opacity-0 group-hover:opacity-100 transition-opacity',
							size !== 'sm' && 'opacity-50',
						)}
					>
						<XIcon class="h-3 w-3 shrink-0 ml-auto" />
					</button>
				</Button>
			{:else if pin.note}
				{@const href = `/note/${pin.note.id}`}
				<Button
					{size}
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class={cn(
						'w-full justify-start font-normal group',
						// size !== 'sm' && 'text-base',
					)}
					{href}
					on:click={(e) => {
						if (
							e.target instanceof HTMLButtonElement &&
							e.target !== e.currentTarget
						) {
							e.preventDefault();
						}
					}}
				>
					<!-- <Tag class="mr-2 h-4 w-4 shrink-0" /> -->
					<!-- <div class="h-4 w-4 mr-2 shrink-0 flex items-center justify-center">
                                            <TagColorPill color={pin.tag.color} class="h-2 w-2" />
                                        </div> -->
					<Icon
						class="h-4 w-4 mr-2"
						icon={pin.note.icon}
						color={pin.note.color}
					/>
					<span class="truncate grow"> {pin.note.title ?? 'Untitled'}</span>
					<button
						on:click={() => {
							{
								$deletePinMutation.mutate({
									id: pin.id,
								});
							}
						}}
						class={cn(
							'opacity-0 group-hover:opacity-100 transition-opacity',
							size !== 'sm' && 'opacity-50',
						)}
					>
						<XIcon class="h-3 w-3 shrink-0 ml-auto" />
					</button>
				</Button>
			{:else if pin.entry}
				{@const href = make_link(pin.entry)}
				<Button
					{size}
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class={cn(
						'w-full justify-start font-normal group',
						// size !== 'sm' && 'text-base',
					)}
					{href}
					on:click={(e) => {
						if (
							e.target instanceof HTMLButtonElement &&
							e.target !== e.currentTarget
						) {
							e.preventDefault();
						}
					}}
				>
					<EntryIcon class="h-4 w-4 mr-2 shrink-0" type={pin.entry.type} />
					<span class="truncate grow">
						{pin.entry.bookmarkTitle ?? pin.entry.title ?? 'Untitled'}</span
					>
					<button
						on:click={() => {
							{
								$deletePinMutation.mutate({
									id: pin.id,
								});
							}
						}}
						class={cn(
							'opacity-0 group-hover:opacity-100 transition-opacity',
							size !== 'sm' && 'opacity-50',
						)}
					>
						<XIcon class="h-3 w-3 shrink-0 ml-auto" />
					</button>
				</Button>
			{/if}
		</div>
	{:else}
		<span
			class="text-muted-foreground min-h-[20px] text-xs px-2 mx-auto flex items-center justify-center"
			>No items</span
		>
	{/each}
</div>
