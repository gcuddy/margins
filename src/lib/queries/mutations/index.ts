import { InfiniteData, QueryClient, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { MutationInput, mutation, QueryOutput, mutate } from '../query';
import type { LibraryResponse } from '$lib/server/queries';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import type { QueryFactory } from '../querykeys';
import { toast } from 'svelte-sonner';

type UpdateData = Partial<LibraryResponse['entries'][number]>;

const mutateStatus = (queryClient: QueryClient) => {
	createMutation({
		mutationFn: (input: MutationInput<'update_status'>) => mutation({}, 'update_status', input),
		onMutate(variables) {}
	});
};

/**
 * Bad name for it. These are queries that shouldn't usually be invalidated when a mutation on entries occurs.
 */
const ctxEntries = ['count', 'authors'] satisfies (keyof QueryFactory['entries'])[];

// TODO clean this up

export function createTagMutation() {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: (input: MutationInput<'createTag'>) => mutate('createTag', input),
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
		}
	});
}

export function updateAnnotationMutation(opts?: { showToast?: boolean }) {
    const queryClient = useQueryClient();
    return createMutation({
        mutationFn: (input: MutationInput<"save_note">) => mutate("save_note", input),
        onMutate(variables) {
            console.log(`onMutate variables for updateAnnotationMutation`, variables)
        },
        onSuccess() {
            if (opts?.showToast) {
                toast.success("Note updated")
            }
            queryClient.invalidateQueries({queryKey: ['annotations']})
            queryClient.invalidateQueries({queryKey: ['entries', 'list']})
            queryClient.invalidateQueries({queryKey: ['entries', 'detail']})
        }
    })
}

export function createSetTagsMutation(opts?: { optimistic?: boolean; showToast?: boolean }) {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: (input: MutationInput<'set_tags_on_entry'>) => {
			return mutation(get(page), 'set_tags_on_entry', input);
		},
		onMutate: async ({ entries, tags }) => {
			if (!opts?.optimistic) return;
			const queryKey = ['entries', 'list'] as const;
			await queryClient.cancelQueries({
				queryKey
			});
			const previousQueries = queryClient.getQueriesData<InfiniteData<LibraryResponse>>({
				queryKey
			});

			console.log({ previousQueries });

			const tagsToUpdate = (tags?.filter((tag) => tag.id) ?? []) as { id: number; name: string }[];

			queryClient.setQueriesData<InfiniteData<LibraryResponse>>({ queryKey }, (data) => {
				if (!data) return data;
				return {
					...data,
					pages: data.pages.map((p) => {
						return {
							...p,
							entries: p.entries.map((oldEntry) => {
								if (entries.includes(oldEntry.id)) {
									return {
										...oldEntry,
										tags: tagsToUpdate ?? []
									};
								}
								return oldEntry;
							})
						};
					})
				};
			});
		},
		onSuccess() {
			queryClient.invalidateQueries({
				// queryKey: ["entries"],
				predicate(query) {
					return query.queryKey[0] === 'entries' && !ctxEntries.includes(query.queryKey[1] as any);
				}
			});
			if (opts?.showToast) {
				toast.success('Tags updated');
			}
		}
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
	ids: number[],
	newData: Partial<LibraryResponse['entries'][number]>
) {
	const queryKey = ['entries'] as const;

	// cancel current queries
	await queryClient.cancelQueries({
		queryKey
	});

	const previousQueries = queryClient.getQueriesData<EntryOutputs>({ queryKey });

	// optimistically update
	queryClient.setQueriesData<EntryOutputs>({ queryKey }, (old: EntryOutputs | undefined) => {
		if (!old) return old;

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
								...newData
							};
						}
						return entry;
					})
				}))
			};
		}

		if (Array.isArray(old)) {
			return old.map((entry) => {
				if (ids.includes(entry.id)) {
					return {
						...entry,
						...newData
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
	});
}

// REVIEW should make a single generic type for state
export async function updateEntries(
	queryClient: QueryClient,
	ids: number[],
	newData: Partial<LibraryResponse['entries'][number]>
) {
	// REVIEW can I get this from queryfactory?
	const queryKey = ['entries', 'list'] as const;
	await queryClient.cancelQueries({
		queryKey
	});
	const previousQueries = queryClient.getQueriesData<InfiniteData<LibraryResponse>>({
		queryKey
	});

	console.log({ previousQueries });

	// queryClient.getQueryCache().

	queryClient.setQueriesData<InfiniteData<LibraryResponse>>({ queryKey }, (data) => {
		if (!data) return data;
		return {
			...data,
			pages: data.pages.map((p) => {
				return {
					...p,
					entries: p.entries.map((oldEntry) => {
						if (ids.includes(oldEntry.id)) {
							return {
								...oldEntry,
								...newData
							};
						}
						return oldEntry;
					})
				};
			})
		};
	});

	// TODO return previous Queries

	return {
		queryKey,
		previousQueries
	};

	// queryClient.
}
