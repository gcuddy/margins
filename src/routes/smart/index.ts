import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';

export const GET: RequestHandler = async () => {
	try {
		const lists = await db.smartList.findMany();
		return {
			status: 200,
			body: {
				lists
			}
		};
	} catch (e) {
		return {
			status: 400
		};
	}
};

export const POST: RequestHandler = async ({ request }) => {
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
			status: 200,
			body: {
				id: smartList.id
			}
		};
	} catch (e) {
		return {
			status: 400
		};
	}
};
