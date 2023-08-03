/// <reference types="lucia-auth" />

declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type UserAttributes = {
			username: string;
		};
	}
}

/// <reference types="@sveltejs/kit" />
declare namespace App {
	type AuthRequest = import('lucia-auth').AuthRequest;

	interface Locals extends AuthRequest {}

	interface PageData {
		// user?: import('$lib/user').RootUserData;
		// user?: import("$lib/trpc/router").RouterOutputs["user"]["getUser"] & {
		//     stateIdToLocation: Map<number, import("@prisma/client").Location>;
		//     stateIdToName: Map<number, string>;
		//     states: import("$lib/trpc/router").RouterOutputs["user"]["getStates"];
		//     subscriptions: import("$lib/trpc/router").RouterOutputs["subscriptions"]["list"];
		// };
		user_data?: {
			tags?: Promise<{ id: number; name: string }[]>;
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
		S3_BUCKET_PREFIX: string;
	}
}

declare type Item = import('svelte-dnd-action').Item;
declare type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		onfinalize?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		onenter?: (event: CustomEvent) => void;
		onexit?: (event: CustomEvent) => void;
	}
}

// interface Meta {
//     persist?: boolean;
//     init?: any;
// }

// declare module '@tanstack/svelte-query' {
// 	interface QueryMeta extends Meta {}
// }
