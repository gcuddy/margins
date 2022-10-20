import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async () => {
	console.log('here are our lists');
	const lists = await db.list.findMany();
	console.log({ lists });
	return json(lists);
};
