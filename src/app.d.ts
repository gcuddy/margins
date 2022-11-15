/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import('$lib/server/lucia.js').Auth;
	type UserAttributes = {
		email: string;
		username: string;
	};
}

/// <reference types="@sveltejs/kit" />
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		getSession: import('@lucia-auth/sveltekit').GetSession;
		getSessionUser: import('@lucia-auth/sveltekit').GetSessionUser;
		setSession: import('@lucia-auth/sveltekit').SetSession;
	}
}
