/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		namespace Superforms {
			type Message = import('$lib/types/forms').Message;
		}

		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
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

			// states?: import("@prisma/client").State[];
			filterMap?: import('$lib/stores/filter').FilterMapStore;
			queryClient?: import('@tanstack/svelte-query').QueryClient;

			S3_BUCKET_PREFIX?: string;

			// FORMS
			logInteractionForm?: import('sveltekit-superforms').SuperValidated<
				import('$components/entries/interaction-form/schema').InteractionLogInputSchema
			>;
			saveToLibraryForm?: import('sveltekit-superforms').SuperValidated<
				import('$lib/schemas/inputs/entry.schema').SaveToLibrarySchema
			>;

			flash?: import('$lib/types/forms').Message;
		}
	}
}

export {};
