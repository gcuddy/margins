import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { get, readable } from 'svelte/store';
import type { LayoutServerLoad } from './$types';
import { type User, user as userStore, user_data_dirty } from '$lib/stores/user';

export const load: LayoutServerLoad = async ({ fetch, locals, parent }) => {
	const data = await parent();
	console.log({ data });
	const session = await locals.getSession();
	console.log(`(app)/+layout.server.ts: load: session: ${JSON.stringify(session)}`);
	console.log({ session });
	if (!session) throw redirect(302, '/login');
	const dirty = get(user_data_dirty);
	// If we already have a stored user, then don't fetch it again - we'll be using the store
	if (browser && get(userStore) && !dirty) {
		console.log('returning user store');
		return {
			user: userStore,
		};
	}

	// // Fetch the user, store it, return it
	// This is not the best way to do it...
	const res = await fetch('/api/fetch_user_data');
	const fetchedUser: User = await res.json();
	return fetchedUser;
	console.log('fetched data');
	// user_data_dirty.set(false);
	// if (!res.ok) {
	// 	// await signOut();
	// 	throw redirect(302, '/login');
	// 	// window.location.href = '/'
	// 	return {
	// 		user: readable({
	// 			username: '??',
	// 			feeds: [],
	// 			favorites: [],
	// 		}),
	// 	};
	// }

	console.log('fetched user', { fetchedUser });
	if (browser) {
		userStore.set(fetchedUser);
		return {
			user: userStore,
		};
	}
	// last resort - return a readable store
	return {
		user: readable(fetchedUser),
	};
};
