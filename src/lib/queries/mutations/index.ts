import { InfiniteData, QueryClient, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { MutationInput, mutation, QueryOutput } from '../query';
import type { LibraryResponse } from '$lib/server/queries';
import { get } from 'svelte/store';
import { page } from '$app/stores';

type UpdateData = Partial<LibraryResponse['entries'][number]>;

const mutateStatus = (queryClient: QueryClient) => {
	createMutation({
		mutationFn: (input: MutationInput<'update_status'>) => mutation({}, 'update_status', input),
		onMutate(variables) {

        }
	});
};


export function createSetTagsMutation() {
    const queryClient = useQueryClient();
    return createMutation({
        mutationFn: (input: MutationInput<"set_tags_on_entry">) => {
            return mutation(get(page), 'set_tags_on_entry', input)
        },
        onMutate(...args) {
            console.log('mutating set tags', args)
        },
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["entries"]
            })
        }
    })
}

// TODO: update entry state across al...

//

// update entries

// type EntryQueries = QueryFactory['entries'];

// Map over EntryQueries type and get return value of each function, and the awaited return value of each queryFn

// TODO make this automatically inferred from queryFactory
type EntryOutputs = InfiniteData<LibraryResponse> | QueryOutput<"entry_by_id"> | QueryOutput<"search_titles">



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

    const previousQueries = queryClient.getQueriesData<EntryOutputs>({queryKey});

    // optimistically update
    queryClient.setQueriesData<EntryOutputs>({queryKey}, (old: EntryOutputs | undefined) => {
        if (!old) return old;

        // check for infinite data
        if ("pages" in old) {
            old
            return {
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    entries: page.entries.map((entry) => {
                        if (ids.includes(entry.id)) {
                            return {
                                ...entry,
                                ...newData
                            }
                        }
                        return entry;
                    })
                }))
            }
        }

        if (Array.isArray(old)) {
            return old.map((entry) => {
                if (ids.includes(entry.id)) {
                    return {
                        ...entry,
                        ...newData
                    }
                }
                return entry;
            })
        }

        return old;

        // TODO: update individual entry by id, but types don't match

        // return {
        //     ...old,
        //     ...newData
        // }

        return old;
    })
}

// REVIEW should make a single generic type for state
export async function updateEntries(queryClient: QueryClient, ids: number[], newData: Partial<LibraryResponse['entries'][number]>) {
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
                        if (
                            ids.includes(oldEntry.id)
                        ) {
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
    }

    // queryClient.
}
