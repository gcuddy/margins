import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { get, readable } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { User, user as userStore, user_data_dirty } from '$lib/stores/user';

export const load: LayoutLoad = async ({ parent, fetch }) => {
	const { lucia } = await parent();
	if (!lucia) throw redirect(302, '/login');

	console.log('running root +layout.ts', { lucia });
	const dirty = get(user_data_dirty);
	// If we already have a stored user, then don't fetch it again - we'll be using the store
	if (browser && get(userStore) && !dirty) {
		console.log('returning user store');
		return {
			user: userStore,
		};
	}

	// Fetch the user, store it, return it
	const res = await fetch('/api/fetch_user_data', {
		headers: {
			Authorization: `Bearer ${lucia.access_token}`,
		},
	});
	console.log('fetched data');
	user_data_dirty.set(false);
	if (!res.ok) {
		// await signOut();
		throw redirect(302, '/login');
		// window.location.href = '/'
		return {
			user: readable({
				username: '??',
				feeds: [],
				favorites: [],
			}),
		};
	}
	const fetchedUser: User = await res.json();
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
