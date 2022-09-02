import { browser } from '$app/environment';
import { FavoriteModel, RssFeedModel } from '$lib/types/schemas/prisma';
import { redirect } from '@sveltejs/kit';
import { get, readable } from 'svelte/store';
import { z } from 'zod';
import type { LayoutLoad } from './$types';
import { User, user as userStore } from '$lib/stores/user';

export const load: LayoutLoad = async ({ parent, fetch }) => {
	const { lucia } = await parent();
	if (!lucia) throw redirect(302, '/login');

	// If we already have a stored user, then don't fetch it again - we'll be using the store
	if (browser && get(userStore)) {
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
	if (!res.ok) {
		throw redirect(302, '/login');
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
