import { trpc } from "$lib/trpc/client";
import type { Prisma } from "@prisma/client";
import type { QueryOptions } from "@tanstack/svelte-query";
import type { TRPCClientInit } from "trpc-sveltekit";

export const queryKeys = {
	filter: ["filter"] as const,
	entries: (filter: Prisma.EntryWhereInput) => [...queryKeys.filter, "entries", filter],
};

export const entryFilterQuery = (init: TRPCClientInit, filter: Prisma.EntryWhereInput) =>
	({
		queryKey: queryKeys.entries(filter),
		queryFn: async () =>
			trpc(init).filters.entries.query({
				where: filter,
			}),
	} satisfies QueryOptions);
