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
		user?: import('$lib/user').RootUserData;
		currentList?: import('$lib/stores/currentList').CurrentList;
	}
}
