import type { PageServerLoad, Action } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';

export const load: PageServerLoad = async () => {
	try {
		const lists = await db.smartList.findMany({
			include: {
				favorite: {
					select: {
						id: true
					}
				}
			}
		});
		return {
			lists
		};
	} catch (e) {
		throw error(400, 'error fetching lists');
	}
};


