/// <reference types="lucia-sveltekit" />
declare namespace Lucia {
	type Auth = import('$lib/server/lucia.js').Auth;
	type UserAttributes = {
		email: string;
	};
}

/// <reference types="@sveltejs/kit" />
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		getSession: import('lucia-sveltekit/types').GetSession;
		setSession: import('lucia-sveltekit/types').SetSession;
		clearSession: import('lucia-sveltekit/types').ClearSession;
	}
}
