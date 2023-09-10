<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import {
		BookMarked,
		ChevronDown,
		ChevronRightIcon,
		FilmIcon,
		Library,
		PencilIcon,
		Plus,
	} from 'lucide-svelte';
	import MarkdownIt from 'markdown-it';
	import { onMount, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';

	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Command from '$components/ui/command2';
	import { createCommandDialogStore } from '$components/ui/command2/utils';
	import Header from '$components/ui/Header.svelte';
	import { Entries, Movies } from '$lib/commands';
	import Annotations from '$lib/commands/Annotations.svelte';
	import PinButton from '$lib/components/PinButton.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from '$lib/components/ui/dropdown-menu';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/Separator.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import { nanoid } from '$lib/nanoid';
	import {
		mutate,
		mutation,
		type MutationInput,
		query,
	} from '$lib/queries/query';
	import { isValidUrl } from '$lib/utils';
	import { cn } from '$lib/utils/tailwind';

	import CollectionItem from './collection-item.svelte';
	import CollectionItemCard from './collection-item-card.svelte';

	const md = new MarkdownIt();

	const bookmarkCreateMutation = createMutation({
		mutationFn: (input: MutationInput<'bookmarkCreate'>) =>
			mutate('bookmarkCreate', input),
		onMutate(variables) {
			if (variables.collection?.collectionId === data.collection.id) {
				data.collection.items.push({
					id: variables.collection.id ?? nanoid(),
					//@ts-expect-error - we're using this to show a loading state
					pending: true,
				});
				data.collection.items = data.collection.items;
			}
		},
		onSuccess() {
			invalidate('collection');
		},
	});

	export let data;

	$: ({ pin_id } = data.collection);
	const commander = createCommandDialogStore();

	const { enhance, form } = superForm(data.form, {
		dataType: 'json',
	});
	let form_el: HTMLFormElement;
	let editing = false;

	const updateCollectionItemsPositionsMutation = createMutation({
		mutationFn: (input: MutationInput<'updateCollectionItemsPosition'>) =>
			mutate('updateCollectionItemsPosition', input),
	});

	const addToCollectionMutation = createMutation({
		mutationFn: async (
			input: Omit<MutationInput<'addToCollection'>, 'collectionId'>,
		) => {
			return mutation($page, 'addToCollection', {
				collectionId: data.collection.id,
				...input,
			});
		},
		onSuccess() {
			invalidate('collection');
		},
	});

	function addEntry() {
		commander.open({
			component: Entries,
			placeholder: 'Search for an entry...',
			props: {
				onSelect: async (entry) => {
					$addToCollectionMutation.mutate({
						entryId: entry.id,
					});
					commander.close();
				},
			},
		});
	}
	function addNote() {
		commander.open({
			component: Annotations,
			placeholder: 'Search for a note...',
			props: {
				onSelect: async (a) => {
					commander.close();
					$addToCollectionMutation.mutate({
						annotationId: a.id,
					});
					// awaitinvalidate('entry');
					await invalidate('collection');
				},
			},
		});
	}
	// function addMedia(type = 'movie') {
	// 	commander.open({
	// 		component: Media,
	// 		placeholder: `Search for a ${type}...`,
	// 		props: {
	// 			onSelect: async (a) => {
	// 				commander.close();
	// 				const entry = await query($page, 'findOrCreateEntry', {
	// 					tmdbId: a.id,
	// 				});
	// 				if (!entry) {
	// 					return;
	// 				}
	// 				await mutation($page, 'addToCollection', {
	// 					collectionId: data.collection.id,
	// 					entryId: entry.id,
	// 				});
	// 				await invalidate('collection');
	// 			},
	// 		},
	// 		shouldFilter: false,
	// 	});
	// }
	function addMovie() {
		commander.open({
			component: Movies,
			placeholder: `Search for a movie...`,
			props: {
				onSelect: async (a) => {
					commander.close();
					const entry = await query($page, 'findOrCreateEntry', {
						tmdbId: a.id,
					});
					if (!entry) {
						return;
					}
					$addToCollectionMutation.mutate({
						entryId: entry.id,
					});
					await invalidate('collection');
				},
			},
		});
	}

	let loaded = false;

	onMount(() => {
		tick().then(() => {
			setTimeout(() => {
				// wait a second, then set loaded to true (this will enable transitions)
				loaded = true;
			}, 900);
		});
	});
</script>

<Header>
	<span class="flex items-center gap-2 font-medium tracking-tight"
		>Collections <ChevronRightIcon class="text-muted-foreground h-4 w-4" />
		{data.collection.name}</span
	>
</Header>

<div class="flex items-center justify-between">
	<div class="flex items-center gap-x-2">
		{#if !editing}
			<H1>{data.collection.name}</H1>
			<Button on:click={() => (editing = !editing)} variant="secondary">
				<PencilIcon class="mr-2 h-4 w-4" /> Edit
			</Button>
		{:else}
			<form method="post" use:enhance action="?/edit">
				<Input
					class="h-auto text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
					bind:value={$form.name}
				/>
				<Button on:click={() => (editing = false)} variant="secondary"
					>Save</Button
				>
			</form>
		{/if}
	</div>

	<div class="flex items-center gap-x-2">
		<div
			class="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground"
		>
			<Button variant="secondary" on:click={addEntry}>
				<Plus class="mr-2 h-4 w-4" />
				Add
			</Button>
			<Separator orientation="vertical" class="h-[20px]" />
			<DropdownMenu>
				<DropdownMenuTrigger
					class={cn(
						buttonVariants({
							variant: 'secondary',
						}),
						'px-2',
					)}
				>
					<Button variant="secondary" class="px-2">
						<ChevronDown class="h-4 w-4 text-secondary-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent class="w-[200px]">
					<DropdownMenuGroup>
						<DropdownMenuItem on:click={addEntry}>
							<Library class="mr-2 h-4 w-4" /> Entry
						</DropdownMenuItem>
						<DropdownMenuItem on:click={addNote}>
							<BookMarked class="mr-2 h-4 w-4" /> Note
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem on:click={addMovie}>
							<FilmIcon class="mr-2 h-4 w-4" /> Movie
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
		<PinButton {pin_id} />
	</div>
</div>
<div class="mt-4">
	{#if editing}
		<form
			bind:this={form_el}
			use:enhance
			method="post"
			action="?/edit"
			class="contents"
		>
			<Textarea
				on:blur={(e) => {
					form_el.requestSubmit();
				}}
				bind:value={$form.description}
				placeholder="Description"
				rows={4}
				class="mt-2 h-auto max-w-prose"
			/>
			<noscript>
				<Button type="submit">Save</Button>
			</noscript>
		</form>
	{:else if $form.description}
		<div class="prose prose-sm prose-stone dark:prose-invert">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html md.render($form.description)}
		</div>
	{/if}
</div>

<form action="?/add_section" method="post">
	<Button>Add section</Button>
</form>

<svelte:document
	on:paste={async (e) => {
		const a = document.activeElement;
		if (a instanceof HTMLTextAreaElement || a instanceof HTMLInputElement) {
			return;
		}
		// REVIEW: is this how I want to go about this? or should it be scoped more somehow?
		e.preventDefault();
		const paste = e.clipboardData?.getData('text');
		if (paste && isValidUrl(paste)) {
			toast.promise(
				$bookmarkCreateMutation.mutateAsync({
					collection: {
						collectionId: data.collection.id,
						id: nanoid(),
					},
					status: null,
					url: paste,
				}),
				{
					error: 'Failed to add link to collection',
					loading: 'Adding link to collection…',
					success: 'Link added to collection',
				},
			);
		}
		// TODO: interactive toast with setting option for allowing paste or disabling paste
	}}
/>

<!-- {JSON.stringify(data.collection.items)} -->
<!-- grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] -->
<div
	class="mt-8 flex flex-wrap gap-4"
	use:dndzone={{
		dragDisabled: !data.collection.items.length,
		flipDurationMs: 200,
		items: data.collection.items,
		morphDisabled: true,
		type: 'collection-items',
	}}
	on:consider={(e) => {
		data.collection.items = e.detail.items;
	}}
	on:finalize={(e) => {
		data.collection.items = e.detail.items;
		// Now deal with updating positions
		const { info } = e.detail;
		const { id } = info;
		// find the item that was dragged
		const idx = data.collection.items.findIndex((i) => i.id === id);
		if (idx === -1) {
			return;
		}
		const moved = data.collection.items[idx];
		if (!moved) {
			return;
		}
		// Get new position
		if (idx === 0) {
			const newPosition = (data.collection.items[1]?.position ?? 0) - 100;
			moved.position = newPosition;
			$updateCollectionItemsPositionsMutation.mutate([
				{
					collectionId: data.collection.id,
					id,
					position: newPosition,
				},
			]);
		} else if (idx === data.collection.items.length - 1) {
			const newPosition = (data.collection.items[idx - 1]?.position ?? 0) + 100;
			moved.position = newPosition;
			$updateCollectionItemsPositionsMutation.mutate([
				{
					collectionId: data.collection.id,
					id,
					position: newPosition,
				},
			]);
		} else {
			// see if we can slot between the two items
			const prevPosition = data.collection.items[idx - 1]?.position ?? 0;
			const nextPosition = data.collection.items[idx + 1]?.position ?? 0;
			if (nextPosition - prevPosition > 1) {
				const newPosition = Math.round((prevPosition + nextPosition) / 2);
				moved.position = newPosition;
				$updateCollectionItemsPositionsMutation.mutate([
					{
						collectionId: data.collection.id,
						id,
						position: newPosition,
					},
				]);
			} else {
				// TODO: handle case where we can't slot between the two items
			}
		}
	}}
>
	{#each data.collection.items as item (item.id)}
		<div animate:flip={{ duration: 200 }}>
			{#if 'pending' in item && item.pending}
				<CollectionItemCard loading />
			{:else}
				{#if item.type === 'Section'}
					Section
				{/if}
				<CollectionItem shouldTransition={loaded} {item} />
			{/if}
		</div>
	{:else}
		<div class="p-8 flex flex-col gap-2 items-center justify-center w-full">
			<span class="text-muted-foreground">No items yet</span>
			<Button on:click={addEntry} variant="secondary" size="sm">
				<Plus class="mr-2 h-4 w-4" />
				Add item
			</Button>
		</div>
	{/each}
</div>

<Command.Dialog bind:open={$commander.open}>
	<Command.Input placeholder={$commander.placeholder} />
	<Command.List>
		<svelte:component this={$commander.component} {...$commander.props} />
	</Command.List>
</Command.Dialog>
