import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { FavoriteWithPayload } from '$lib/types/schemas/Favorite';
export const load: LayoutLoad = async ({ fetch }) => {
	const res = await fetch('/favorites.json', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw error(400, 'not found');
	}
	const { favorites } = await res.json();
	return {
		favorites: favorites as FavoriteWithPayload[]
	};
};
