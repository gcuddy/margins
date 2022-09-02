import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	console.time('get notebook');
	const annotations = await db.annotation.findMany({
		include: {
			article: {
				select: {
					author: true,
					description: true,
					id: true,
					title: true,
					url: true,
					siteName: true
				}
			}
		},
		orderBy: {
			updatedAt: 'desc'
		}
	});
	console.timeEnd('get notebook');
	if (annotations) {
		return {
			annotations
		};
	} else {
		throw error(404, 'Annotations not found');
	}
};
