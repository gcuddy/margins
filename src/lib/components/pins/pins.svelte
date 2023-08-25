<script lang="ts">
	import PinFolder from './pin-folder.svelte';
	import { mutate, type MutationInput, type QueryOutput } from '$lib/queries/query';
	import { dndzone, setDebugMode, TRIGGERS } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import Button from '$components/ui/Button.svelte';
	import { page } from '$app/stores';
	import { Layers, Box, Folder } from 'lucide-svelte';
	import { TagColorPill } from '$components/tags/tag-color';
	import { Icon } from '$components/icon-picker';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { make_link } from '$lib/utils/entries';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { nanoid } from '$lib/nanoid';
	import { createEventDispatcher } from 'svelte';
	import type { Pin } from '$lib/queries/server';
	import { initCreatePinMutation } from '$lib/queries/mutations';
	import { slide } from 'svelte/transition';
	export let pins: (Pin & {
		pending?: boolean;
	})[];

	const queryClient = useQueryClient();

	let className = '';
	export { className as class };

	const updatePinMutation = createMutation({
		mutationFn: (input: MutationInput<'updateFavorite'>) => mutate('updateFavorite', input)
	});

	const createPinMutation = initCreatePinMutation();

	function updateQueryData() {
		queryClient.setQueryData<Pin[]>(['pins', 'list'], (data) => {
			console.log({ data });
			if (!data) return data;
			return pins;
		});
	}

	export let root = false;
	export let parentId: string | null = null;
	export let show = true;

	let foldersOpen: Record<string, boolean> = {};

	$: if (root) console.log({ pins });

	const dispatch = createEventDispatcher();

	$: console.log({ foldersOpen });

	let lastIndex: number | null = null;

	export const addFolder = () =>
		(pins = [
			{
				id: nanoid(),
				sortOrder: (pins[0]?.sortOrder ?? 1) - 1,
				type: 'FOLDER',
				updatedAt: new Date(),
				createdAt: new Date(),
				entry: null,
				view: null,
				collection: null,
				tag: null,
				note: null,
				parentId: null,
				folderName: '',
				children: [],
				pending: true
			},
			...pins
		]);
</script>

<div
	class={className}
	use:dndzone={{
		items: pins,
		flipDurationMs: 200
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
			} else if (index < pins.length - 1 && pins[index + 1]?.type === 'FOLDER') {
				console.log('open folder');
				const pin = pins[index + 1];
				if (pin) {
					foldersOpen[pin.id] = true;
				}
			}
			lastIndex = index;
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
			newSortOrder = ((pins[index - 1]?.sortOrder ?? 0) + (pins[index + 1]?.sortOrder ?? 0)) / 2;
		}

		const pin = pins[index];

		// Should not be the case
		if (!pin) return;

		pin.sortOrder = newSortOrder;
		pin.parentId = parentId;
		pins = pins;
		console.log({ id, index, pin, newSortOrder, root, parentId });

		if (root) {
			updateQueryData();
			$updatePinMutation.mutate({
				id: pin.id,
				data: {
					sortOrder: newSortOrder
				}
			});
		} else {
			dispatch('update');
			$updatePinMutation.mutate({
				id: pin.id,
				data: {
					sortOrder: newSortOrder,
					parentId
				}
			});
		}
	}}
>
	{#each pins as pin (pin.id)}
		<div
			animate:flip={{
				duration: 200
			}}
		>
			{#if pin.type === 'FOLDER'}
				<PinFolder
					onBlur={() => {
						if (pin.pending && !pin.folderName) {
							pins = pins.filter((p) => p.id !== pin.id);
							return;
						} else if (pin.pending) {
							// create folder
							console.log({ pin });
							$createPinMutation.mutate({
								id: pin.id,
								folderName: pin.folderName,
								sortOrder: pin.sortOrder
							});
						}
						pin.pending = false;
					}}
					bind:renaming={pin.pending}
					on:update={updateQueryData}
					bind:open={foldersOpen[pin.id]}
					bind:pin
				/>
				<!-- <Button size="sm" variant="ghost" class="w-full justify-start font-normal">
					<Folder class="mr-2 h-4 w-4 shrink-0" />
					{pin.folderName}
				</Button> -->
			{:else if pin.view}
				{@const href = `/tests/views/${pin.view.id}`}
				<Button
					size="sm"
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class="w-full justify-start font-normal"
					{href}
				>
					<Layers class="mr-2 h-4 w-4 shrink-0" />
					{pin.view.name}</Button
				>
			{:else if pin.collection}
				{@const href = `/tests/collection/${pin.collection.id}`}
				<Button
					size="sm"
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class="w-full justify-start font-normal"
					{href}
				>
					<Box class="mr-2 h-4 w-4 shrink-0" />
					<span class="truncate"> {pin.collection.name}</span></Button
				>
			{:else if pin.tag}
				{@const href = `/tests/tag/${pin.tag.name}`}
				<Button
					size="sm"
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class="w-full justify-start font-normal"
					{href}
				>
					<!-- <Tag class="mr-2 h-4 w-4 shrink-0" /> -->
					<div class="h-4 w-4 mr-2 shrink-0 flex items-center justify-center">
						<TagColorPill color={pin.tag.color} class="h-2 w-2" />
					</div>
					<span class="truncate"> {pin.tag.name}</span>
				</Button>
			{:else if pin.note}
				{@const href = `/tests/note/${pin.note.id}`}
				<Button
					size="sm"
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class="w-full justify-start font-normal"
					{href}
				>
					<!-- <Tag class="mr-2 h-4 w-4 shrink-0" /> -->
					<!-- <div class="h-4 w-4 mr-2 shrink-0 flex items-center justify-center">
                                            <TagColorPill color={pin.tag.color} class="h-2 w-2" />
                                        </div> -->
					<Icon class="h-4 w-4 mr-2" icon={pin.note.icon} color={pin.note.color} />
					<span class="truncate"> {pin.note.title ?? 'Untitled'}</span>
				</Button>
			{:else if pin.entry}
				{@const href = make_link(pin.entry)}
				<Button
					size="sm"
					variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
					class="w-full justify-start font-normal"
					{href}
				>
					<EntryIcon class="h-4 w-4 mr-2" type={pin.entry.type} />
					<span class="truncate"> {pin.entry.title ?? 'Untitled'}</span>
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
