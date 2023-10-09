
import type { CreateQueryOptions } from "@tanstack/svelte-query";
import type { TRPCClientInit } from "trpc-sveltekit";

export const movieDetailQuery = (id: number, init?: TRPCClientInit) =>
	({
		queryKey: ["movies", "details", id],
		queryFn: async () => trpc(init).movies.public.byId.query(id),
		staleTime: 5 * 1000 * 60,
		// refetchOnWindowFocus: false,
		onSettled: (data) => console.log(data),
	} satisfies CreateQueryOptions);

export const tvDetailQuery = (id: number, init?: TRPCClientInit) =>
	({
		queryKey: ["tv", "details", id],
		queryFn: async () => trpc(init).movies.public.tvById.query(id),
		staleTime: 5 * 1000 * 60,
		// refetchOnWindowFocus: false,
		onSettled: (data) => console.log(data),
	} satisfies CreateQueryOptions);
