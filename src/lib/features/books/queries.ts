import type { CreateQueryOptions } from "@tanstack/svelte-query";
import debounce from "lodash.debounce"
import type { TRPCClientInit } from "trpc-sveltekit";

import { trpc } from "$lib/trpc/client";

export const queryKeys = {
	book: ["book"] as const,
	search: () => [...queryKeys.book, "search"],
	searchQuery: (value: string) => [...queryKeys.search(), value] as const,
};

const debounced = debounce(async (init: TRPCClientInit, value: string) => {
	return trpc(init).books.public.search.query(value);
}, 300);

function asyncDebounce<F extends (...args: any[]) => Promise<any>>(func: F, wait?: number) {
	const throttled = debounce((resolve, reject, args: Parameters<F>) => {
		func(...args)
			.then(resolve)
			.catch(reject);
	}, wait);
	return (...args: Parameters<F>): ReturnType<F> =>
		new Promise((resolve, reject) => {
			throttled(resolve, reject, args);
		}) as ReturnType<F>;
}

const debouncedSearch = asyncDebounce(
	async (init: TRPCClientInit, value: string) => trpc(init).books.public.search.query(value),
	500
);

debounced;

// const fn = async () => trpc(init).books.public.search.query(value)

export const searchBookQuery = (init: TRPCClientInit, value: string) =>
	({
		queryKey: queryKeys.searchQuery(value),
		queryFn: async () => debouncedSearch(init, value),
		keepPreviousData: true,
		staleTime: 5 * 1000 * 60,
		enabled: !!value,
	} satisfies CreateQueryOptions);
