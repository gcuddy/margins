import type { Entry } from "@prisma/client";
import type { CreateQueryOptions, QueryClient } from "@tanstack/svelte-query";
import type { TRPCClientInit } from "trpc-sveltekit";

import { commandPaletteStore } from "$lib/components/CommandPalette/store";
import { showCommandPalette } from "$lib/stores/commands";
import { trpc } from "$lib/trpc/client";
import type { RouterInputs } from "$lib/trpc/router";

import EntryListItem__SvelteComponent_ from "./EntryListItem.svelte";

export const queryKeys = {};
// REVIEW: query key naming for best practices
export const entriesByLocationQuery = (input: RouterInputs["entries"]["listBookmarks"], init?: TRPCClientInit) => ({
    queryKey: ["entries", {
        ...input
    }],
    queryFn: async () => trpc(init).entries.listBookmarks.query(input),
    staleTime: 1000 * 60 * 60
}) satisfies CreateQueryOptions;

export const getEntriesFromCache = (queryClient: QueryClient) => {
    const data = queryClient.getQueriesData<Entry>(["entries"]);
    return data.flatMap(([, entry]) => entry).filter(e => e) as Entry[];
}

export const searchEntriesQuery = (input: RouterInputs["entries"]["search"], init?: TRPCClientInit) => ({
    queryKey: ["entries", "search", input.query],
    queryFn: async () => trpc(init).entries.search.query(input),
    staleTime: 1000 * 60 * 60 * 24,
}) satisfies CreateQueryOptions;

export const entryDetailsQuery = (input: RouterInputs["entries"]["load"], init?: TRPCClientInit) => ({
    queryKey: ["entries", "details", {
        ...input
    }],
    queryFn: async () => trpc(init).entries.load.query(input),
    staleTime: 1000 * 60 * 60 * 24,
}) satisfies CreateQueryOptions;

export const entryCollectionsQuery = (input: RouterInputs["entries"]["getCollections"], init?: TRPCClientInit) => ({
    queryKey: ["entries", "collections", input.id],
    queryFn: async () => trpc(init).entries.getCollections.query(input),
    staleTime: 1000 * 60 * 60 * 24,
}) satisfies CreateQueryOptions;

export const annotateEntryMutation = () => {
    // TODO:
}

export function showEntrySelector(queryClient: QueryClient, onSelect: (e: CustomEvent<Entry>) => void) {
    const cachedEntries = getEntriesFromCache(queryClient);
    // const query =
    // TODO: group into recent
    console.log({ cachedEntries })
    showCommandPalette.out();
    // grab entries from queryclient, search for rest
    commandPaletteStore.open<Entry>({
        // values: cachedEntries,
        query: (value) => ({
            queryKey: ["entries", "search", value],
            keepPreviousData: true,
            queryFn: async () => trpc().entries.search.query({
                query: value,
                title: true,
                author: true,
                text: false
            }),
            placeholderData: cachedEntries.filter((e) => {
                return e.title?.toLowerCase().includes(value.toLowerCase()) || e.author?.toLowerCase().includes(value.toLowerCase());
            }),
            select: (data) => {
                // keep placeholder data at the top, but de-dupe by id
                const filteredCachedEntries = cachedEntries.filter(e => e.title?.toLowerCase().includes(value.toLowerCase()) || e.author?.toLowerCase().includes(value.toLowerCase()))
                const deduped = [...filteredCachedEntries, ...data].reduce((acc, cur) => {
                    if (!acc.some((e) => e.id === cur.id)) {
                        acc.push(cur);
                    }
                    return acc;
                }, [] as Entry[]);
                console.log({ deduped })
                return deduped;
            },
            enabled: value.length > 2
            // enabled: value.length > 2,
        }),
        slot: ({ value, active }) => ({
            component: EntryListItem__SvelteComponent_,
            props: {
                entry: value,
                active
            }
        }),
        onSelect
    })
}
