import type { Command } from '$lib/types/command';
import { Collections, Entries } from '$lib/commands';
import type { LibraryEntry } from '$lib/server/queries';
import { CardStackPlus, Link2, File as FileIcon } from 'radix-icons-svelte';
import { commanderStore } from '$lib/commands/GenericCommander.svelte';
import { mutate } from '$lib/queries/query';
import type { QueryClient } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';
import { invalidateEntries } from '$lib/queries/mutations';
import { invalidate } from '$app/navigation';

type Entry = Pick<
	LibraryEntry,
	'id' | 'type' | 'googleBooksId' | 'spotifyId' | 'tmdbId' | 'podcastIndexId'
>;
export const entryCommands = (
	queryClient: QueryClient,
): Array<Command<Entry>> => [
	{
		text: 'Add Relation',
		icon: Link2,
		action: (entry) => {
			if (!entry) return;
			commanderStore.open({
				component: Entries,
				placeholder: 'Add relation to...',
				props: {
					onSelect(chosen_entry) {
						// console.log({ entry });
						commanderStore.close();
						mutate('addRelation', {
							entryId: entry.id,
							relatedEntryId: chosen_entry.id,
						});
					},
				},
				shouldFilter: false,
			});
		},
	},
	{
		text: 'Add to Collection',
		icon: CardStackPlus,
		action: (entry) => {
			if (!entry) return;
			commanderStore.open({
				component: Collections,
				placeholder: 'Add to collection...',
				props: {
					onSelect(collection) {
						// console.log({ entry });
						commanderStore.close();
						toast.promise(
							mutate('addToCollection', {
								collectionId: collection.id,
								entryId: entry.id,
							}),
							{
								loading: 'Adding to collection...',
								success: () => {
									invalidateEntries(queryClient);
									return 'Added to collection';
								},
								error: 'Failed to add to collection',
							},
						);
					},
				},
				shouldFilter: false,
			});
		},
	},
	{
		text: 'Attach PDF',
		icon: FileIcon,
		action: (entry) => {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = 'pdf';
			input.onchange = () => {
				if (input.files?.length) {
					const file = input.files[0];
					if (!file) {
						return;
					}
					handle_pdf_upload(file, entry, queryClient);
					return;
				}
			};
			input.click();
		},
	},
];

function handle_pdf_upload(file: File, entry: Entry, queryClient: QueryClient) {
	if (!file.type.includes('pdf')) {
		toast.error('File must be a PDF');
	} else if (file.size / 1024 / 1024 > 100) {
		toast.error('File size too big (max 100MB).');
	} else {
		toast.promise(
			fetch(`/api/upload?related_entry_id=${entry.id}`, {
				body: file,
				method: 'POST',
			}),
			{
				error: 'Error uploading file',
				loading: 'Uploading...',
				success: () => {
					invalidate('entry');
					invalidateEntries(queryClient);
					return 'File uploaded';
				},
			},
		);
	}
}
