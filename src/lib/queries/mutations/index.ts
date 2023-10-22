import {
	createMutation,
	type InfiniteData,
	type QueryClient,
	type QueryKey,
	useQueryClient,
	QueryFilters,
} from '@tanstack/svelte-query';
import { get } from 'svelte/store';
import { toast } from 'svelte-sonner';

import { page } from '$app/stores';
import { makeAnnotation, omit } from '$lib/helpers';
import type { BookmarkCreateInput } from '$lib/schemas/inputs/bookmark.schema';
import type { LibraryEntry, LibraryResponse } from '$lib/server/queries';

import {
	mutate,
	mutation,
	type MutationInput,
	type QueryOutput,
} from '../query';
import { getQueryContext, queryFactory, type QueryFactory } from '../querykeys';
import type { Note, NotesResponse } from '../server';
import { entryState } from '$lib/stores/entry-state';

type UpdateData = Partial<LibraryResponse['entries'][number]>;

export const useStatusMutation = () => {
	const queryClient = useQueryClient();
	const ctx = getQueryContext(queryClient);
	return createMutation({
		mutationFn: (input: MutationInput<'update_status'>) =>
			mutate('update_status', input),

		// onMutate({ ids, status }) {
		// 	// this is legit easier, sorry haters
		// 	entryState.update((state) => {
		// 		for (const id of ids) {
		// 			state[id] = {
		// 				...state[id],
		// 				status,
		// 			};
		// 		}
		// 		return state;
		// 	});
		// },
		onMutate: async ({ ids, status }) => {
			const { previous, reset } = await optimisticUpdateLibrary(
				queryClient,
				(entry) => {
					if (ids.includes(entry.id)) {
						return {
							...entry,
							status,
						};
					}
					return entry;
				},
			);
			console.log({ previous, reset });
			return {
				previous,
				reset,
			};
		},
		onError(err, variables, context) {
			if (context) {
				context.reset();
			}
		},
		onSettled() {
			invalidateEntries(queryClient);
		},
		onSuccess() {
			toast.success('Status updated');
		},
		mutationKey: ['update_status'],
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
	return queryClient.invalidateQueries({
		queryKey: ['entries'],
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

const libraryQueryFilter: QueryFilters = {
	queryKey: ['entries', 'list'],
	predicate: (query) => {
		// check to make sure querykey[3] is object
		return !query.queryKey[3] || typeof query.queryKey[3] === 'object';
	},
};

/**
 * Helper function to cancel outgoing entries queries, snapshot data, set new data, and return snapshot
 * @param queryClient
 */
export async function optimisticUpdateLibrary(
	queryClient: QueryClient,
	mapFn: (entry: LibraryEntry) => LibraryEntry,
) {
	await queryClient.cancelQueries({
		queryKey: ['entries'],
	});

	const previous =
		queryClient.getQueriesData<InfiniteData<LibraryResponse>>(
			libraryQueryFilter,
		);

	const setDataData = previous.flatMap(([key, data]) => data);

	console.log({ previous, setDataData });
	setGetLibraryData(queryClient, mapFn);

	const reset = () => {
		previous.forEach(([key, data]) => {
			queryClient.setQueryData(key, data);
		});
	};

	return {
		previous,
		reset,
	};
}

/**
 * Simple function to get the entries-> list data (not ctx relations) so that it can be used for snapshots etc
 */
export function getLibraryData(queryClient: QueryClient) {}

export function setGetLibraryData(
	queryClient: QueryClient,
	mapFn: (entry: LibraryEntry) => LibraryEntry,
) {
	queryClient.setQueriesData<InfiniteData<LibraryResponse>>(
		{
			queryKey: ['entries', 'list'],
			predicate: (query) => {
				// check to make sure querykey[3] is object
				return !query.queryKey[3] || typeof query.queryKey[3] === 'object';
			},
		},
		(old) => {
			if (!old) return old;

			const newData = {
				...old,
				pages: old.pages.map((page) => {
					return {
						...page,
						entries: page.entries.map((entry) => {
							return mapFn(entry);
						}),
					};
				}),
			};

			console.log({ newData });

			return newData;
		},
	);
}

export function updateAnnotationMutation<
	TDefaultData extends Partial<MutationInput<'save_note'>>,
>(opts?: {
	input?: TDefaultData;
	invalidateEntries?: boolean;
	onSuccess?: () => void;
	showToast?: boolean;
}) {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: MutationInput<'save_note'>) =>
			mutate('save_note', { ...opts?.input, ...input }),
		async onMutate(variables) {
			// console.log(`onMutate variables for updateAnnotationMutation`, variables);

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
			if (
				('entryId' in mergedVariables && mergedVariables?.entryId) ||
				opts?.invalidateEntries
			) {
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
	const { getData } = getQueryContext(queryClient);

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
			// const previousQueries = queryClient.getQueriesData<
			// 	InfiniteData<LibraryResponse>
			// >({
			// 	queryKey,
			// });

			// console.log({ previousQueries });

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
		onSuccess(_, { tags }) {
			const shouldInvalidateTags = tags?.some((tag) => !tag.id);
			if (shouldInvalidateTags) {
				queryClient.invalidateQueries({ queryKey: ['tags'] });
			}
			queryClient.invalidateQueries({
				queryKey: ['entries', 'list'],
				// predicate(query) {
				// 	return (
				// 		query.queryKey?.[0] === 'entries' &&
				// 		!ctxEntries.includes(query.queryKey[1] as CtxEntry)
				// 	);
				// },
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
	// console.log('invalidating query keys', queryKeys);
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

export function initUpdateBookmarkMutation(opts?: {
	invalidate?: boolean;
	/** Whether or not to invalidate the entire "entries" scope */
	invalidateAllEntries?: boolean;
}) {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: MutationInput<'updateBookmark'>) =>
			mutate('updateBookmark', input),
		onSuccess() {
			if (opts?.invalidate !== false) {
				invalidateEntries(queryClient, opts?.invalidateAllEntries);
			}
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

	// console.log({ previousQueries });

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

const createAnnotateMutation = () => {
	const queryClient = useQueryClient();
	const annotateMutation = createMutation({
		mutationFn: async (input: MutationInput<'save_note'>) => {
			const { data } = get(page);
			if (!data.entry) {
				return;
			}
			return mutate('save_note', {
				entryId: data.entry.id,
				...input,
			});
		},
		onError: (err, newTodo, context) => {
			toast.error('Failed to save annotation');
			if (context) {
				// @ts-expect-error - TODO: why is ts complaining about this?
				queryClient.setQueryData(queryKey, context.previousEntryData);
			}
		},
		async onMutate(newData) {
			await queryClient.cancelQueries({
				queryKey: ['entries'],
			});

			// Snapshot the previous value
			const previousEntryData =
				queryClient.getQueryData<QueryOutput<'entry_by_id'>>(queryKey);

			// // Optimistically update to the new value
			queryClient.setQueryData<QueryOutput<'entry_by_id'>>(queryKey, (old) => {
				if (!old) {
					return old;
				}
				if (!old.entry) {
					return old;
				}

				const ids = Array.isArray(newData.id) ? newData.id : [newData.id];

				const newAnnotations = ids.map((id) => {
					const { tags, ...rest } = newData;
					// TODO: tags
					return makeAnnotation({
						id: id!,
						...rest,
					});
				});

				const oldIds = old.entry.annotations?.map((a) => a.id) ?? [];
				const annotationsToAdd = newAnnotations.filter(
					(a) => !oldIds.includes(a.id),
				);

				const updatedAnnotations = (old.entry.annotations ?? [])
					.map((annotation) => {
						if (ids.includes(annotation.id)) {
							return {
								...annotation,
								...newAnnotations.find((a) => a.id === annotation.id),
							};
						}
						return annotation;
					})
					.concat(annotationsToAdd);

				annotations = updatedAnnotations;

				return {
					...old,
					entry: {
						...old.entry,
						annotations: [...updatedAnnotations],
					},
				};
			});

			if ($rightSidebar) {
				await tick();
				const sidebarEl = document.getElementById('entry-sidebar');
				if (sidebarEl) {
					const annotationEl = sidebarEl.querySelector(
						`[data-sidebar-annotation-id="${newData.id}"]`,
					);
					if (annotationEl) {
						annotationEl.scrollIntoView();
					}
				}
				// scroll to new annotation
			}

			// // Return a context object with the snapshotted value
			return { previousEntryData };
		},
		onSettled(data, error, variables, context) {
			void queryClient.invalidateQueries({
				queryKey: ['entries'],
			});
		},
	});
	return annotateMutation;
};
