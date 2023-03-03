import { type RequestHandler, json } from '@sveltejs/kit';

import { db } from '$lib/db';
export const GET: RequestHandler = async ({ url, locals }) => {
	// const session = await locals.validate();
	// if (!session) {
	// 	throw error(401, 'Not authorized');
	// }
	const session = {
		userId: 'clawrbftc0000qdq238od0o14',
	};
	const since = url.searchParams.get('since');
	const date = since ? new Date(since) : undefined;
	// since is way preferred over page for cursor based nav — that's what we'll stick with for now
	const ids = url.searchParams.get('ids')?.split(',') || [];
	const read = url.searchParams.get('read') === 'false' ? false : true;
	const take = Number(url.searchParams.get('take')) || 50;
	//TODO: cursor and some sort of paginatioN? or is since enough?
	const entries = await db.entry.findMany({
		take,
		where: {
			createdAt: {
				gt: date,
			},
		},
	});
	return json(entries);
};
