/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import('$lib/server/lucia.js').Auth;
	type UserAttributes = {
		email: string;
		username: string;
		default_state_id: number;
	};
}

/// <reference types="@sveltejs/kit" />
declare namespace App {
	interface Locals {
		validate: import('@lucia-auth/sveltekit').Validate;
		validateUser: import('@lucia-auth/sveltekit').ValidateUser;
		setSession: import('@lucia-auth/sveltekit').SetSession;
	}
	interface PageData {
		// user?: import('$lib/user').RootUserData;
		user?: {
			userId: string;
			username: string;
			default_state_id: number;
			email: string;
		};
		currentList?: import('$lib/stores/currentList').CurrentList;
		tags?: import('@prisma/client').Tag[];
		subscriptions: import("$lib/trpc/router").RouterOutputs["user"]["data"]["subscriptions"];
		states?: import('@prisma/client').State[];
	}
}

declare type Item = import('svelte-dnd-action').Item;
declare type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		onfinalize?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
	}
}
