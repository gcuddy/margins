import { QueryClient } from "@tanstack/svelte-query";

import { browser } from "$app/environment";

import type { LayoutLoad } from "./$types";
import { favoritesQuery } from "./Sidebar.svelte";

export const load = (async (e) => {
	const { data } = e;
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				// set queries to be stale after 20 seconds
				staleTime: 20 * 1000,
			},
		},
	});

	// get favorites
	console.time("favorites");
	const favorites = data.authorized ?  await queryClient.ensureQueryData(favoritesQuery(e)) : []
	console.log({ favorites });
	console.timeEnd("favorites");

	return { queryClient, favorites, ...data };
}) satisfies LayoutLoad;
