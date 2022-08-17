import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ url, params }) => {
	const list = await db.smartList.findFirst({
		where: {
			id: Number(params.id)
		},
		include: {
			favorite: true
		}
	});
	if (!list) {
		return {
			status: 400
		};
	}
	return {
		status: 200,
		body: {
			list
		}
	};
};
