import { db } from '$lib/db';

export async function getLists() {
	const lists = await db.collection.findMany({
		where: {
			//userid
		},
	});
}
