<script lang="ts">
	import type { Entry } from '@prisma/client';
	import {
		ArrowLeftRight,
		BookOpen,
		Clock,
		Edit,
		ListPlus,
		LoaderIcon,
		MoreHorizontal,
		Paperclip,
		Repeat
	} from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { entryTypeIcon } from '$components/entries/icons';
	import AlertDialogHelper from '$components/helpers/AlertDialogHelper.svelte';
	import Collections from '$lib/commands/Collections.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import type AnnotationForm from '$lib/components/AnnotationForm.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuSub,
		DropdownMenuSubContent,
		DropdownMenuSubTrigger,
		DropdownMenuTrigger	} from '$lib/components/ui/dropdown-menu';
	import { initAttachmentCreateMutation } from '$lib/queries/mutations';
	import { mutation, query } from '$lib/queries/query';
	import type { LibraryEntry } from '$lib/server/queries';
	import { state, update_entry } from '$lib/state/entries';
	import { createAlertDialogStore } from '$lib/stores/dialog';
	import { convertToTypes } from '$lib/types';
	import { getId } from '$lib/utils/entries';

	import NoteForm from './NoteForm.svelte';

	export let data: ComponentProps<AnnotationForm>['data'];
	export let entry: Pick<
		LibraryEntry,
		'id' | 'type' | 'googleBooksId' | 'spotifyId' | 'tmdbId' | 'podcastIndexId'
	>;

	let show_note_form = false;
	let show_reading_session = false;

	const commander_store = getCommanderContext();

    const attachmentCreateMutation = initAttachmentCreateMutation();

	function handleCollectionSelect(collection: { id: number }) {
		commander_store.close();
		mutation($page, 'addToCollection', {
			collectionId: collection.id,
			entryId: entry.id
		}).then(() => {
			toast.success('Added to collection');
			invalidate('entry');
		});
	}

	function handle_pdf_upload(file: File) {
		if (!file.type.includes('pdf')) {
			toast.error('File must be a PDF');
		} else if (file.size / 1024 / 1024 > 100) {
			toast.error('File size too big (max 100MB).');
		} else {
			toast.promise(
				fetch(`/api/upload?related_entry_id=${entry.id}`, {
					body: file,
					method: 'POST'
				}),
				{
					error: 'Error uploading file',
					loading: 'Uploading...',
					success: () => {
						invalidate('entry');
						return 'File uploaded';
					}
				}
			);
		}
	}

    function handle_epub_upload(file: File) {
        if (!file.type.includes('epub')) {
            toast.error('File must be an ePub');
        } else if (file.size / 1024 / 1024 > 100) {
            toast.error('File size too big (max 100MB).');
        } else {
            toast.promise(
                fetch(`/api/epub`, {
                    body: file,
                    method: 'POST'
                }),
                {
                    error: 'Error uploading file',
                    loading: 'Uploading...',
                    success: () => {
                        return 'File parsed (check console)';
                    }
                }
            );
        }
    }

	const dialogStore = createAlertDialogStore();
</script>

<DropdownMenu>
	<DropdownMenuTrigger class={buttonVariants({ variant: 'ghost' })}>
		<MoreHorizontal />
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56">
		<DropdownMenuGroup>
			<DropdownMenuItem
				on:click={() => {
					show_note_form = true;
				}}
			>
				<Edit class="mr-2 h-4 w-4" />
				<span>Make a note</span></DropdownMenuItem
			>
			<DropdownMenuItem>
				<Clock class="mr-2 h-4 w-4" />
				<span>Snooze</span></DropdownMenuItem
			>
			{#if entry.type === 'book'}
				<DropdownMenuItem on:click={() => (show_reading_session = true)}>
					<BookOpen class="mr-2 h-4 w-4" />
					<span>Start reading session</span></DropdownMenuItem
				>
			{/if}
		</DropdownMenuGroup>
		<DropdownMenuGroup>
			<DropdownMenuItem
				on:click={() => {
					commander_store.open({
						component: JumpToEntry,
						placeholder: 'Add relation to...',
						props: {
							onSelect(chosen_entry) {
								console.log({ entry });
								commander_store.close();
								mutation($page, 'addRelation', {
									entryId: entry.id,
									relatedEntryId: chosen_entry.id
								}).then(() => {
									toast.success('Added to collection');
									invalidate('entry');
								});
							}
						},
						shouldFilter: false
					});
				}}
			>
				<ArrowLeftRight class="mr-2 h-4 w-4" />
				<span>Add Relation</span></DropdownMenuItem
			>
			<DropdownMenuItem
				on:click={() => {
					commander_store.open({
						component: Collections,
						placeholder: 'Add to collection...',
						props: {
							onSelect: handleCollectionSelect
						}
					});
				}}
			>
				<ListPlus class="mr-2 h-4 w-4" />
				<span>Add to Collection</span></DropdownMenuItem
			>
			{#if entry.type === 'article'}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Repeat class="mr-2 h-4 w-4" />
						<span>Convert to…</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{#each convertToTypes.filter((type) => entry.type !== type.value) as type}
							<DropdownMenuItem
								on:click={() => {
									if (type.value === 'book') {
										dialogStore.open({
											action: async (value) => {
												// update_entry(entry.id, { type: type.value });
												// dialogStore.reset();
												console.log({ value });
												if (!value) {return;}
												const book = await query($page, 'getBookByIsbn', value);
												if (!book?.id) {
													toast.error('Unable to find book with that ISBN');
													return;
												}
												const data = await mutation($page, 'convertEntry', {
													googleBooksId: book.id,
													id: entry.id,
													type: 'book'
												});
												if (!data.id) {
													toast.error('Failed to convert entry');
													return;
												}
												await goto(`/tests/book/${getId(data)}`);
											},
											description: 'Please enter ISBN',
											title: 'Convert to book',
											value: ''
										});
									}
								}}
							>
								<svelte:component this={entryTypeIcon[type.value]} class="mr-2 h-4 w-4" />
								<span>{type.label}</span>
							</DropdownMenuItem>
						{/each}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			{/if}
			<DropdownMenuItem
				on:click={() => {
					const input = document.createElement('input');
					input.type = 'file';
					input.accept = 'pdf';
					input.onchange = () => {
						if (input.files?.length) {
							const file = input.files[0];
							if (!file) {return;}
							handle_pdf_upload(file); return;
						}
					};
					input.click();
				}}
			>
				<Paperclip class="mr-2 h-4 w-4" />
				<span>Attach PDF</span>
			</DropdownMenuItem>
			<DropdownMenuItem
				on:click={() => {
					const input = document.createElement('input');
					input.type = 'file';
					input.accept = 'epub';
					input.onchange = () => {
						if (input.files?.length) {
							const file = input.files[0];
							if (!file) {return;}
							handle_epub_upload(file); return;
						}
					};
					input.click();
				}}
			>
				<Paperclip class="mr-2 h-4 w-4" />
				<span>Attach ePub</span>
			</DropdownMenuItem>
			<DropdownMenuItem
				on:click={() => {
					dialogStore.open({
                        action(value) {
                            if (!value) {return;}
                            // $attachmentCreateMutation.mutate({
                            //     url: value
                            // });
                        },
                        description: "Please enter URL",
                        title: 'Attach URL',
                    })
				}}
			>
				<Paperclip class="mr-2 h-4 w-4" />
				<span>Attach URL…</span>
			</DropdownMenuItem>
		</DropdownMenuGroup>
		<!-- <DropdownMenuItem>Billing</DropdownMenuItem>
		<DropdownMenuItem>Team</DropdownMenuItem>
		<DropdownMenuItem>Subscription</DropdownMenuItem> -->
	</DropdownMenuContent>
</DropdownMenu>

<NoteForm bind:isOpen={show_note_form} {data} {entry} />

<!-- Dialog here -->

<AlertDialogHelper store={dialogStore} />

<!-- <Dialog.Root>
    <Dialog.Content>
        <input type
    </Dialog.Content>
</Dialog.Root> -->
