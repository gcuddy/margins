import { trpc } from "$lib/trpc/client";
import type { RouterInputs, RouterOutputs } from "$lib/trpc/router";
import type { Maybe, Router } from "@trpc/server";
import { derived, writable } from "svelte/store";
import type { TRPCClientInit } from "trpc-sveltekit";

type DetailedSubscription = RouterOutputs["subscriptions"]["loadAll"];

export async function createSubscriptionStore(f: typeof fetch, data: {
    initialData?: Maybe<DetailedSubscription>
}) {
    const { initialData } = data;
    const subscriptionStore = writable<DetailedSubscription>(initialData || []);

    const updateFeedWithEntries = async (id: number, output: RouterOutputs["entries"]["byFeed"]) => {
        console.log(`QUERY FEED`)
        const { entries, nextCursor } = output;
        console.log({ entries, nextCursor })
        const newIds = new Set([...entries.map(e => e.id)]);
        subscriptionStore.update($s => {
            const idx = $s.findIndex(s => s.feedId === id);
            // 1. filter out old
            let updatedEntries = $s[idx].feed.entries.filter(e => !newIds.has(e.id));
            // 2. add in new
            updatedEntries = [...updatedEntries, ...entries];
            // patch back in
            $s[idx].feed.entries = updatedEntries;

            return $s;
        });
        return {
            nextCursor
        }
    }




    const { subscribe, set, update } = subscriptionStore;

    const entries = derived(subscriptionStore, $s => $s.flatMap(s => s.feed.entries))

    return {
        subscribe,
        entries,
        updateFeedWithEntries
    }

}