import {
	createMutation,
	type InfiniteData,
	type QueryClient,
	type QueryKey,
	useQueryClient,
} from '@tanstack/svelte-query';
import { get } from 'svelte/store';
import { toast } from 'svelte-sonner';

import { page } from '$app/stores';
import { omit } from '$lib/helpers';
import type { BookmarkCreateInput } from '$lib/schemas/inputs/bookmark.schema';
import type { LibraryResponse } from '$lib/server/queries';

import {
	mutate,
	mutation,
	type MutationInput,
	type QueryOutput,
} from '../query';
import type { QueryFactory } from '../querykeys';
import type { Note, NotesResponse } from '../server';

type UpdateData = Partial<LibraryResponse['entries'][number]>;

const mutateStatus = (queryClient: QueryClient) => {
	createMutation({
		mutationFn: (input: MutationInput<'update_status'>) =>
			mutation({}, 'update_status', input),
		onMutate(variables) {},
	});
};

/**
 * Bad name for it. These are queries that shouldn't usually be invalidated when a mutation on entries occurs.
 */
const ctxEntries = ['count', 'authors', 'all'] satisfies Array<
	keyof QueryFactory['entries']
>;

type CtxEntry = (typeof ctxEntries)[number];

export const invalidateEntries = (queryClient: QueryClient, all = false) => {
	queryClient.invalidateQueries({
		// queryKey: ["entries"],
		predicate(query) {
			if (all) {
				return query.queryKey[0] === 'entries';
			}
			return (
				query.queryKey[0] === 'entries' &&
				!ctxEntries.includes(query.queryKey[1] as CtxEntry)
			);
		},
	});
};

// TODO clean this up

export function createTagMutation() {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: (input: MutationInput<'createTag'>) =>
			mutate('createTag', input),
		// onMutate(variables) {
		//     queryClient.cancelQueries('tags');
		//     const previousTags = queryClient.getQueryData('tags');
		//     queryClient.setQueryData('tags', (old: any) => {
		//         return [...old, variables];
		//     });
		//     return { previousTags };
		// },
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['tags'] });
		},
	});
}

export function updateAnnotationMutation<
	TDefaultData extends Partial<MutationInput<'save_note'>>,
>(opts?: {
	input?: TDefaultData;
	onSuccess?: () => void;
	showToast?: boolean;
}) {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: MutationInput<'save_note'>) =>
			mutate('save_note', { ...opts?.input, ...input }),
		async onMutate(variables) {
			console.log(`onMutate variables for updateAnnotationMutation`, variables);

			// setting optimistically isn't too hard, since we just have two main query key scopes to consider (list and detail)
			// Remember 4 Steps: 1) Cancel 2) Snapshot 3) Optimsitically update 4) Return Context with Previous and New Item

			await queryClient.cancelQueries({
				queryKey: ['notes'],
			});

			// Since detail->id is seeded by list, this should be fine
			const previousNote = queryClient.getQueryData<Note>([
				'notes',
				'detail',
				variables.id,
			]);

			if (variables.id) {
				// TODO: get tags and relations too

				const ids = Array.isArray(variables.id) ? variables.id : [variables.id];
				for (const id of ids) {
					queryClient.setQueryData<Note>(['notes', 'detail', id], (old) => {
						if (!old) {
							return old;
						}
						if (!id) {
							return old;
						}
						return {
							...old,
							...omit(variables, 'id', 'tags', 'relations'), //TODO: why can't i get these too
						};
					});
				}
				queryClient.setQueriesData<InfiniteData<NotesResponse>>(
					{ queryKey: ['notes', 'list'] },
					(data) => {
						if (!data) {
							return data;
						}
						return {
							...data,
							pages: data.pages.map((page) => ({
								...page,
								notes: page.notes.map((note) => {
									if (ids.includes(note.id)) {
										return {
											...note,
											...omit(variables, 'id', 'tags', 'relations'),
										};
									}
									return note;
								}),
							})),
						};
					},
				);
			}
			return {
				previousNote,
			};
		},
		onSuccess(data, variables) {
			const mergedVariables = { ...opts?.input, ...variables };
			if (opts?.showToast) {
				toast.success('Note updated');
			}
			// only invalidate entries if we have an entryId
			if ('entryId' in mergedVariables && mergedVariables?.entryId) {
				queryClient.invalidateQueries({ queryKey: ['entries', 'list'] });
				queryClient.invalidateQueries({ queryKey: ['entries', 'detail'] });
			}
			queryClient.invalidateQueries({ queryKey: ['notes'] });
			opts?.onSuccess?.();
		},
	});
}

export function createSetTagsMutation(opts?: {
	optimistic?: boolean;
	showToast?: boolean;
}) {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: MutationInput<'set_tags_on_entry'>) => {
			return mutation(get(page), 'set_tags_on_entry', input);
		},
		onMutate: async ({ entries, tags }) => {
			if (!opts?.optimistic) {
				return;
			}
			const queryKey = ['entries', 'list'] as const;
			await queryClient.cancelQueries({
				queryKey,
			});
			const previousQueries = queryClient.getQueriesData<
				InfiniteData<LibraryResponse>
			>({
				queryKey,
			});

			console.log({ previousQueries });

			const tagsToUpdate = (tags?.filter((tag) => tag.id) ?? []) as Array<{
				id: number;
				name: string;
			}>;

			queryClient.setQueriesData<InfiniteData<LibraryResponse>>(
				{ queryKey },
				(data) => {
					if (!data) {
						return data;
					}
					return {
						...data,
						pages: data.pages.map((p) => {
							return {
								...p,
								entries: p.entries.map((oldEntry) => {
									if (entries.includes(oldEntry.id)) {
										return {
											...oldEntry,
											tags: tagsToUpdate ?? [],
										};
									}
									return oldEntry;
								}),
							};
						}),
					};
				},
			);
		},
		onSuccess() {
			queryClient.invalidateQueries({
				// queryKey: ["entries"],
				predicate(query) {
					return (
						query.queryKey[0] === 'entries' &&
						!ctxEntries.includes(query.queryKey[1])
					);
				},
			});
			if (opts?.showToast) {
				toast.success('Tags updated');
			}
		},
	});
}

function invalidateQueryKeys(
	queryClient: QueryClient,
	queryKeys: Array<QueryKey>,
) {
	console.log('invalidating query keys', queryKeys);
	queryKeys.forEach((queryKey) => {
		queryClient.invalidateQueries({ queryKey });
	});
}

function invalidatePins(queryClient: QueryClient) {
	queryClient.invalidateQueries({ queryKey: ['pins'] });
}

type Invalidate = Array<QueryKey>;

export function initCreatePinMutation(opts?: { invalidate?: Invalidate }) {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: MutationInput<'createFavorite'>) =>
			mutate('createFavorite', input),
		onSuccess() {
			// TODO: set pin cache
			//for now..
			invalidatePins(queryClient);
			if (opts?.invalidate) {
				invalidateQueryKeys(queryClient, opts.invalidate);
			}
		},
	});
}

export function initDeletePinMutation(opts?: {
	invalidate?: Invalidate;
	onSuccess?: () => void;
}) {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: MutationInput<'deleteFavorite'>) =>
			mutate('deleteFavorite', input),
		onSuccess() {
			// TODO: set pin cache
			//for now..
			invalidatePins(queryClient);
			if (opts?.invalidate) {
				invalidateQueryKeys(queryClient, opts.invalidate);
			}
		},
	});
}

export function initBookmarkCreateMutation() {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: BookmarkCreateInput) => mutate('bookmarkCreate', input),
		onSuccess() {
			void queryClient.invalidateQueries({ queryKey: ['entries'] });
		},
	});
}

export function initAttachmentCreateMutation() {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: MutationInput<'attachmentCreate'>) =>
			mutate('attachmentCreate', input),
		onSuccess() {
			void queryClient.invalidateQueries({ queryKey: ['entries'] });
		},
	});
}

// TODO: update entry state across al...

//

// update entries

// type EntryQueries = QueryFactory['entries'];

// Map over EntryQueries type and get return value of each function, and the awaited return value of each queryFn

// TODO make this automatically inferred from queryFactory
type EntryOutputs =
	| InfiniteData<LibraryResponse>
	| QueryOutput<'entry_by_id'>
	| QueryOutput<'search_titles'>;

/**
 * Update entries in the query cache
 * @param queryClient QueryClient
 * @param ids Entry ids to update
 * @param newData New Data to update entries with
 */
async function update_entries(
	queryClient: QueryClient,
	ids: Array<number>,
	newData: Partial<LibraryResponse['entries'][number]>,
) {
	const queryKey = ['entries'] as const;

	// cancel current queries
	await queryClient.cancelQueries({
		queryKey,
	});

	const previousQueries = queryClient.getQueriesData<EntryOutputs>({
		queryKey,
	});

	// optimistically update
	queryClient.setQueriesData<EntryOutputs>(
		{ queryKey },
		(old: EntryOutputs | undefined) => {
			if (!old) {
				return old;
			}

			// check for infinite data
			if ('pages' in old) {
				old;
				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						entries: page.entries.map((entry) => {
							if (ids.includes(entry.id)) {
								return {
									...entry,
									...newData,
								};
							}
							return entry;
						}),
					})),
				};
			}

			if (Array.isArray(old)) {
				return old.map((entry) => {
					if (ids.includes(entry.id)) {
						return {
							...entry,
							...newData,
						};
					}
					return entry;
				});
			}

			return old;

			// TODO: update individual entry by id, but types don't match

			// return {
			//     ...old,
			//     ...newData
			// }

			return old;
		},
	);
}

// REVIEW should make a single generic type for state
export async function updateEntries(
	queryClient: QueryClient,
	ids: Array<number>,
	newData: Partial<LibraryResponse['entries'][number]>,
) {
	// REVIEW can I get this from queryfactory?
	const queryKey = ['entries', 'list'] as const;
	await queryClient.cancelQueries({
		queryKey,
	});
	const previousQueries = queryClient.getQueriesData<
		InfiniteData<LibraryResponse>
	>({
		queryKey,
	});

	console.log({ previousQueries });

	// queryClient.getQueryCache().

	queryClient.setQueriesData<InfiniteData<LibraryResponse>>(
		{ queryKey },
		(data) => {
			if (!data) {
				return data;
			}
			return {
				...data,
				pages: data.pages.map((p) => {
					return {
						...p,
						entries: p.entries.map((oldEntry) => {
							if (ids.includes(oldEntry.id)) {
								return {
									...oldEntry,
									...newData,
								};
							}
							return oldEntry;
						}),
					};
				}),
			};
		},
	);

	// TODO return previous Queries

	return {
		previousQueries,
		queryKey,
	};

	// queryClient.
}
