import { trpc } from "$lib/trpc/client";
import type { CreateQueryOptions, QueryOptions } from "@tanstack/svelte-query";
import type { TRPCClientInit } from "trpc-sveltekit";

export async function getPodcasts() { }

export const queryKeys = {
	all: ["podcasts"] as const,
	searchHolder: () => [...queryKeys.all, "search"] as const,
	search: (value: string) => [...queryKeys.searchHolder(), value] as const,
	detail: (id: number) => [...queryKeys.all, "detail", id] as const,
	episodes: (id: number) => [...queryKeys.detail(id), "episodes"] as const,
	episode: (episodeId: number) => [...queryKeys.all, "episode", episodeId],
};

export const podcastDetailsQuery = (init: TRPCClientInit, id: number) => ({
	queryKey: queryKeys.detail(id),
	queryFn: async () => trpc(init).podcasts.public.getPodcastDetailsByPodcastIndexId.query(id),
	keepPreviousData: true,
});

export const podcastEpisodesQuery = (init: TRPCClientInit, id: number) => ({
	queryKey: queryKeys.episodes(id),
	queryFn: async () => trpc(init).podcasts.public.getPodcastEpisodesByPodcastIndexId.query(id),
	// keepPreviousData: true,
	staleTime: 1000 * 60 * 5,
});
export const podcastEpisodeQuery = (init: TRPCClientInit, episodeId: number) =>
({
	queryKey: queryKeys.episode(episodeId),
	queryFn: async () => trpc(init).podcasts.public.episodeById.query(episodeId),
	// keepPreviousData: true,
	staleTime: 1000 * 60 * 5,
} satisfies CreateQueryOptions);

export const podcastSearchQuery = (init: TRPCClientInit, value: string) => ({
	queryKey: queryKeys.search(value),
	queryFn: async () => trpc(init).podcasts.public.search.query(value),
	keepPreviousData: true,
	enabled: !!value,
	staleTime: 1000 * 60 * 5,
});

export const listPodcastsQuery = (init?: TRPCClientInit) => ({
	queryKey: queryKeys.all,
	queryFn: async () => trpc(init).podcasts.list.query(),
	keepPreviousData: true,
	staleTime: 1000 * 60 * 30,
});
