/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		namespace Superforms {
			type Message = import('$lib/types/forms').Message;
		}

		interface Locals {
			session: import('lucia').Session | null;
			user: import('lucia').User | null;
		}
		interface PageData {
			S3_BUCKET_PREFIX?: string;
			currentList?: import('$lib/stores/currentList').CurrentList;
			current_entry_id?: import('svelte/store').Writable<number | null>;
			entry?: import('$lib/queries/server').EntryDetail;
			// tags?: import("@prisma/client").Tag[];

			// states?: import("@prisma/client").State[];
			filterMap?: import('$lib/stores/filter').FilterMapStore;
			flash?: import('$lib/types/forms').Message;

			// FORMS
			logInteractionForm?: import('sveltekit-superforms').SuperValidated<
				import('$components/entries/interaction-form/schema').InteractionLogInputSchema
			>;

			queryClient?: import('@tanstack/svelte-query').QueryClient;
			saveToLibraryForm?: import('sveltekit-superforms').SuperValidated<
				import('$lib/schemas/inputs/entry.schema').SaveToLibrarySchema
			>;

			user_data?: {
				avatar?: string | null;
				pins?: Promise<
					Array<{
						collection: {
							id: number;
							name: string;
						} | null;
						id: string;
						tag: {
							id: number;
							name: string;
						} | null;
						view: {
							id: number;
							name: string;
						} | null;
					}>
				>;
				tags?: Promise<Array<{ id: number; name: string }>>;
				userId: string;
				username: string;
			};
		}
	}
}

export {};
