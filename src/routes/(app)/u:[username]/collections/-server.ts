import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const GET: RequestHandler = async () => {
	const lists = await db.collection.findMany();
	return json(lists);
};
