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

export const POST: Action = async ({ request }) => {
	// TODO: add schema validation
	try {
		const json = await getJsonFromRequest(request);
		const smartList = await db.smartList.create({
			data: {
				name: json.name,
				filter: json.filter
			}
		});
		return {
			location: `/smart/${smartList.id}`
		};
	} catch (e) {
		throw error(400, 'error creating smart list');
	}
};
