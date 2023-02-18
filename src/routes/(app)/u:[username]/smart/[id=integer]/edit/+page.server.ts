import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
	const list = await db.smartList.findFirst({
		where: {
			id: Number(params.id)
		},
		include: {
			favorite: true
		}
	});
	return {
		list
	};
};
