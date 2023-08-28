/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		interface PageData {
			entry?: import('$lib/queries/server').EntryDetail;
			user_data?: {
				tags?: Promise<Array<{ id: number; name: string }>>;
				pins?: Promise<
					Array<{
						view: {
							id: number;
							name: string;
						} | null;
						collection: {
							id: number;
							name: string;
						} | null;
						tag: {
							id: number;
							name: string;
						} | null;
						id: string;
					}>
				>;
				username: string;
				userId: string;
				avatar?: string | null;
			};
			currentList?: import('$lib/stores/currentList').CurrentList;
			current_entry_id?: import('svelte/store').Writable<number | null>;
			// tags?: import("@prisma/client").Tag[];
			// subscriptions?: import("$lib/trpc/router").RouterOutputs["user"]["data"]["subscriptions"];
			// states?: import("@prisma/client").State[];
			filterMap?: import('$lib/stores/filter').FilterMapStore;
			queryClient?: import('@tanstack/svelte-query').QueryClient;
			favorites?: import('$lib/trpc/router').RouterOutputs['favorites']['list'];
			location?: import('@prisma/client').Location;
			S3_BUCKET_PREFIX?: string;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
			email: string;
			avatar?: string | null;
		};
		type DatabaseSessionAttributes = object;
	}
}

export {};
