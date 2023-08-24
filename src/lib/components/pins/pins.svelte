<script lang="ts">
	import { mutate, type MutationInput, type QueryOutput } from '$lib/queries/query';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { Button } from '$components/ui/button';
	import { page } from '$app/stores';
	import { Layers, Box } from 'lucide-svelte';
	import { TagColorPill } from '$components/tags/tag-color';
	import { Icon } from '$components/icon-picker';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { make_link } from '$lib/utils/entries';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	export let pins: QueryOutput<'pins'>;

	const queryClient = useQueryClient();

	const updatePinMutation = createMutation({
		mutationFn: (input: MutationInput<'updateFavorite'>) => mutate('updateFavorite', input),
		onMutate() {
			queryClient.setQueryData<QueryOutput<'pins'>>(['pins', 'list'], (data) => {
				console.log({ data });
				if (!data) return data;
				return pins;
			});
		}
	});
</script>

<div
	use:dndzone={{
		items: pins,
		flipDurationMs: 200
	}}
	on:consider={(e) => {
		console.log({ e });
		pins = e.detail.items;
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
		pins = pins;

		$updatePinMutation.mutate({
			id: pin.id,
			data: {
				sortOrder: newSortOrder
			}
		});
	}}
>
	{#each pins as pin (pin.id)}
		<div
			animate:flip={{
				duration: 200
			}}
		>
			{#if pin.view}
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
	{/each}
</div>
