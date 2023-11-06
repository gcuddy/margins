<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import {
		ArchiveRestore,
		BookMarked,
		BookIcon,
		ChevronDown,
		ChevronRightIcon,
		FilmIcon,
		Globe2Icon,
		Library,
		LinkIcon,
		LockIcon,
		MoreHorizontalIcon,
		PaletteIcon,
		Plus,
		RulerIcon,
		TrashIcon,
		// UnlockIcon,
		XIcon,
	} from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { toast } from 'svelte-sonner';

	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { IconPicker, Icon } from '$components/icon-picker';
	import * as AlertDialog from '$components/ui/alert-dialog';
	import { Button } from '$components/ui/button';
	import * as Command from '$components/ui/command2';
	import { createCommandDialogStore } from '$components/ui/command2/utils';
	import Header from '$components/ui/Header.svelte';
	import Label from '$components/ui/Label.svelte';
	import * as Popover from '$components/ui/popover';
	import * as Select from '$components/ui/select';
	import autosize from '$lib/actions/autosize';
	import { Entries, Movies, Books } from '$lib/commands';
	import Annotations from '$lib/commands/Annotations.svelte';
	import PinButton from '$lib/components/PinButton.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
		DropdownMenuSub,
		DropdownMenuSubContent,
		DropdownMenuSubTrigger,
		DropdownMenuRadioGroup,
		DropdownMenuRadioItem,
	} from '$lib/components/ui/dropdown-menu';
	import { styleToString } from '$lib/helpers';
	import { hexToHsl } from '$lib/helpers/color';
	import { nanoid } from '$lib/nanoid';
	import {
		mutate,
		mutation,
		type MutationInput,
		query,
	} from '$lib/queries/query';
	import { capitalize, isValidUrl } from '$lib/utils';

	import CollectionItem from './collection-item.svelte';
	import CollectionItemCard from './collection-item-card.svelte';
	import {
		collectionItemWidthIcons,
		collectionItemWidths,
	} from '$lib/schemas/inputs/collection.schema';
	import UnauthedHeader from '$components/unauthed-header.svelte';
	import { pageTitle } from '$lib/stores/page-title';

	export let data;

	$: hsl = hexToHsl(data.collection.bgColor);
	$: hslString = `${hsl[0]}deg ${hsl[1]}% ${hsl[2]}%`;

	const fonts = [
		{
			label: 'Sans',
			value: 'sans',
		},
		{
			label: 'Serif',
			value: 'serif',
		},
		{
			label: 'Mono',
			value: 'mono',
		},
	];

	let font = data.collection.font
		? fonts.find((f) => f.value === data.collection.font)
		: fonts[0];

	$: fontClass =
		font?.value === 'sans'
			? 'font-sans'
			: font?.value === 'serif'
			? 'font-serif'
			: 'font-mono';

	const collectionUpdateMutation = createMutation({
		mutationFn: (input: MutationInput<'collectionUpdate'>['data']) =>
			mutate('collectionUpdate', {
				data: input,
				id: data.collection.id,
			}),
	});

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

	let lastSavedTitle = data.collection.name;
	let lastSavedDescription = data.collection.description;
	let lastSavedBgColor = data.collection.bgColor;
	let lastSavedFont = font;

	$: ({ pin_id } = data.collection);
	const commander = createCommandDialogStore();

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
						width: data.collection.defaultItemWidth,
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
						width: data.collection.defaultItemWidth,
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
						id: a.id,
						type: 'movie',
					});
					if (!entry) {
						return;
					}
					$addToCollectionMutation.mutate({
						entryId: entry.id,
						width: data.collection.defaultItemWidth,
					});
					await invalidate('collection');
				},
			},
		});
	}

	function addBook() {
		commander.open({
			component: Books,
			placeholder: `Search for a book...`,
			props: {
				onSelect: async (book) => {
					commander.close();
					if (!book.id) {
						return;
					}
					const entry = await query($page, 'findOrCreateEntry', {
						id: book.id,
						type: 'book',
					});
					if (!entry) {
						return;
					}
					$addToCollectionMutation.mutate({
						entryId: entry.id,
						width: data.collection.defaultItemWidth,
					});
					await invalidate('collection');
				},
			},
		});
	}

	let isDeleteAlertOpen = false;

    $: pageTitle.set(`${data.collection.name} - Margins`)
</script>

{#if data.session}
	<Header
		class="relative"
		style={data.collection.bgColor
			? styleToString({
					background: `hsl(${hslString} / 0.5)`,
					'border-color': `hsl(${hslString} / 0.75)`,
			  })
			: undefined}
	>
		<svelte:fragment slot="start">
			<span
				class="flex items-center gap-2 truncate text-sm font-medium tracking-tight sm:text-base"
				>Collections <ChevronRightIcon class="h-4 w-4 text-muted-foreground" />
				<span class="truncate">{data.collection.name}</span>
				<div class="flex gap-0.5">
					<DropdownMenu>
						<DropdownMenuTrigger asChild let:builder>
							<Button
								variant="ghost"
								size="icon"
								class="h-9 w-9 hover:bg-accent/90"
								builders={[builder]}
							>
								<MoreHorizontalIcon class="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent class="w-52">
							<DropdownMenuGroup>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<RulerIcon class="mr-2 h-4 w-4" />
										Default item width
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent>
										<DropdownMenuRadioGroup
											value={data.collection.defaultItemWidth ?? undefined}
										>
											{#each collectionItemWidths as width}
												<DropdownMenuRadioItem
													value={width}
													on:click={() => {
														$collectionUpdateMutation.mutate({
															defaultItemWidth: width,
														});
														data.collection.defaultItemWidth = width;
													}}
												>
													<svelte:component
														this={collectionItemWidthIcons[width]}
														class="mr-2 h-4 w-4"
													/>
													{capitalize(width)}
												</DropdownMenuRadioItem>
											{/each}
										</DropdownMenuRadioGroup>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
								<DropdownMenuItem
									on:click={async () => {
										await $collectionUpdateMutation.mutateAsync({
											private: data.collection.private ? 0 : 1,
										});
										data.collection.private = data.collection.private ? 0 : 1;
									}}
								>
									<svelte:component
										this={data.collection.private ? Globe2Icon : LockIcon}
										class="mr-2 h-4 w-4"
									/> Make collection {data.collection.private
										? 'public'
										: 'private'}</DropdownMenuItem
								>
								{#if !data.collection.private}
									<DropdownMenuItem
										on:click={() => {
											// TODO: clear cruft
											navigator.clipboard.writeText(
												$page.url.origin + $page.url.pathname,
											);
											toast('Collection URL copied to clipboard', {
												description:
													'Anyone with the link can view this collection',
											});
										}}
									>
										<LinkIcon class="mr-2 h-4 w-4" />
										Copy public link</DropdownMenuItem
									>
								{/if}
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								{#if data.collection.deleted}
									<DropdownMenuItem
										on:click={async () => {
											$collectionUpdateMutation.mutate({
												deleted: null,
											});
											await invalidate('collection');
										}}
									>
										<ArchiveRestore class="mr-2 h-4 w-4" />
										Restore</DropdownMenuItem
									>
								{:else}
									<DropdownMenuItem
										on:click={() => {
											isDeleteAlertOpen = true;
										}}
									>
										<TrashIcon class="mr-2 h-4 w-4" />
										Delete</DropdownMenuItem
									>
								{/if}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<Popover.Root
						onOpenChange={(open) => {
							if (open === false) {
								// if closing, then save
								if (
									data.collection.bgColor === lastSavedBgColor &&
									font === lastSavedFont
								) {
									return;
								}
								$collectionUpdateMutation.mutate({
									bgColor: data.collection.bgColor,
									font: font?.value,
								});
								lastSavedBgColor = data.collection.bgColor;
								lastSavedFont = font;
								if (font?.value) {
									data.collection.font = font?.value;
								}
							}
						}}
					>
						<Popover.Trigger let:builder asChild>
							<Button
								builders={[builder]}
								variant="ghost"
								size="icon"
								class="h-9 w-9 hover:bg-accent/90"
							>
								<PaletteIcon class="h-4 w-4" />
								<span class="sr-only">Customize</span>
							</Button>
						</Popover.Trigger>
						<Popover.Content>
							<div class="flex flex-col gap-4">
								<div class="flex items-center justify-between">
									<Label for="collection-bg-color">Background color</Label>
									<div class="flex items-center gap-0.5">
										{#if data.collection.bgColor}
											<Button
												on:click={() => {
													data.collection.bgColor = null;
												}}
												variant="ghost"
												size="icon"
												class="h-6 w-6"
											>
												<XIcon class="h-3 w-3" />
											</Button>
										{/if}
										<input
											bind:value={data.collection.bgColor}
											id="collection-bg-color"
											class=""
											type="color"
										/>
									</div>
								</div>
								<div class="flex items-center justify-between">
									<Label for="collection-font">Font</Label>
									<!--  -->
									<Select.Root bind:selected={font}>
										<Select.Trigger class="w-[180px]">
											<Select.Value
												class={fontClass}
												placeholder="Select a  font"
											/>
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="sans" class="font-sans text-xl"
												>Sans</Select.Item
											>
											<Select.Item value="serif" class="font-serif text-xl"
												>Serif</Select.Item
											>
											<Select.Item value="mono" class="font-mono text-xl"
												>Mono</Select.Item
											>
											<!-- TODO: slab serif, heavy sans (or allow customizing font weight, font tracking) -->
										</Select.Content>
									</Select.Root>
								</div>
							</div>
						</Popover.Content>
					</Popover.Root>
				</div>
			</span></svelte:fragment
		>
		<svelte:fragment slot="end">
			<DropdownMenu>
				<DropdownMenuTrigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						size="sm"
						class="flex gap-2 bg-background/75 px-2"
					>
						<Plus class="h-4 w-4" />
						<span class="max-sm:hidden">Add to collection</span>
						<ChevronDown class="h-4 w-4 text-secondary-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent class="w-[200px]">
					<DropdownMenuGroup>
						<DropdownMenuItem on:click={addEntry}>
							<Library class="mr-2 h-4 w-4" /> Library
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
						<DropdownMenuItem on:click={addBook}>
							<BookIcon class="mr-2 h-4 w-4" /> Book
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<PinButton {pin_id} />
		</svelte:fragment>
	</Header>
{:else}
	<UnauthedHeader
		path={[
			{
				name: data.collection.username,
			},
			{
				name: data.collection.name,
			},
		]}
	/>
{/if}

{#if data.collection.deleted}
	<Header>
		<span class="text-muted-foreground">This collection has been deleted</span>
	</Header>
{/if}
<!-- {data.collection.deleted} -->
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
<div
	style:--bg-color={data.collection.bgColor ? hslString : undefined}
	style={styleToString({
		'background-color':
			'hsl(var(--bg-color, var(--background)) / var(--tw-bg-opacity))',
	})}
	class="h-full grow"
>
	<div class="mx-auto flex w-full max-w-prose flex-col gap-2 px-2 md:px-0">
		<div class="flex flex-col pt-3">
			{#if data.admin}
				<IconPicker
					class="bg-background/50"
					bind:activeIcon={data.collection.icon}
					bind:activeColor={data.collection.color}
					on:select={({ detail }) => {
						const { color, icon } = detail;
						$collectionUpdateMutation.mutate({
							color,
							icon,
						});
					}}
				/>
			{:else}
				<Icon class="h-8 w-8" {...data.collection} />
			{/if}
			<!-- TODO: get accessible color combo and tweak till it is using colord -->
			<textarea
				readonly={!data.admin}
				bind:value={data.collection.name}
				on:blur={() => {
					if (!data.admin) {
						return;
					}
					if (data.collection.name === lastSavedTitle) {
						return;
					}
					$collectionUpdateMutation.mutate({
						name: data.collection.name,
					});
					lastSavedTitle = data.collection.name;
				}}
				placeholder="Untitled note"
				use:autosize
				rows={1}
				class="h-auto w-full resize-none appearance-none overflow-hidden bg-transparent py-3 text-3xl font-extrabold tracking-tight placeholder:text-muted-foreground/75 focus:outline-none md:text-4xl lg:text-5xl {fontClass}"
			/>
		</div>
		<!-- TODO: should we render markdown here? -->
		<textarea
			readonly={!data.admin}
			class="apearance-none h-auto w-full resize-none bg-transparent text-muted-foreground transition placeholder:text-muted-foreground/75 focus:outline-none focus-visible:text-foreground {fontClass}"
			placeholder="Notes"
			rows={1}
			use:autosize
			bind:value={data.collection.description}
			on:blur={() => {
				if (!data.admin) {
					return;
				}
				if (data.collection.description === lastSavedDescription) {
					return;
				}
				$collectionUpdateMutation.mutate({
					description: data.collection.description,
				});
				lastSavedDescription = data.collection.description;
			}}
		/>
	</div>

	<!-- <form action="?/add_section" method="post">
	<Button>Add section</Button>
</form> -->

	<!-- {JSON.stringify(data.collection.items)} -->
	<!-- grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] -->
	<div
		class="container mx-auto mt-8 flex flex-wrap items-end justify-start gap-4 px-2 sm:px-4 md:justify-center"
		use:dndzone={{
			dragDisabled: !data.collection.items.length || !data.admin,
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
				const newPosition =
					(data.collection.items[idx - 1]?.position ?? 0) + 100;
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
			<div
				class="flex shrink flex-col items-center justify-center"
				animate:flip={{ duration: 200 }}
			>
				{#if 'pending' in item && item.pending}
					<CollectionItemCard loading />
				{:else}
					{#if item.type === 'Section'}
						Section
					{/if}
					<CollectionItem
						loggedIn={!!data.session}
						admin={data.admin}
						class={fontClass}
						{item}
					/>
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
</div>

<Command.Dialog bind:open={$commander.open}>
	<Command.Input placeholder={$commander.placeholder} />
	<Command.List>
		<svelte:component this={$commander.component} {...$commander.props} />
	</Command.List>
</Command.Dialog>

<AlertDialog.Root bind:open={isDeleteAlertOpen}>
	<AlertDialog.Content>
		<form use:enhance action="?/delete" method="post" class="contents">
			<AlertDialog.Header>
				<AlertDialog.Title>
					Are you sure you'd like to delete this collection?
				</AlertDialog.Title>
				<AlertDialog.Description>
					Deleted collections can be restored within 30 days.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action type="submit">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
