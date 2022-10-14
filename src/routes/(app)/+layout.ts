import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { get, readable } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { User, user as userStore, user_data_dirty } from '$lib/stores/user';
import { getUser } from 'lucia-sveltekit/load';

export const load: LayoutLoad = async (event) => {
	const { fetch } = event;
	const user = await getUser(event);
	if (!user) throw redirect(302, '/login');
	const dirty = get(user_data_dirty);
	// If we already have a stored user, then don't fetch it again - we'll be using the store
	if (browser && get(userStore) && !dirty) {
		console.log('returning user store');
		return {
			user: userStore,
		};
	}

	// // Fetch the user, store it, return it
	const res = await fetch('/api/fetch_user_data');
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
	const fetchedUser: User = await res.json();
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
