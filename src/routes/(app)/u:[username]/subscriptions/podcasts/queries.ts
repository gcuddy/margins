import { trpc } from "$lib/trpc/client";
import { createQuery } from "@tanstack/svelte-query";
import type { TRPCClientInit } from "trpc-sveltekit";

export const queryKeys = {
	all: ["podcasts"] as const,
	episodes: () => [...queryKeys.all, "episodes"],
};

export const allEpisodesQuery = (init: TRPCClientInit) => ({
	queryKey: queryKeys.episodes(),
	queryFn: async () => trpc(init).podcasts.episodes.query(),
	staleTime: 60 * 5 * 1000,
	keepPreviousData: true,
});
