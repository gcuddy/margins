import { error, redirect } from '@sveltejs/kit';

import { annotationExtendedInclude } from '$lib/annotation';
import { db } from '$lib/db';
import type { Location } from '$lib/types/schemas/Locations';

import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, url, depends, parent, locals }) => {
	// TODO: pagination, url params, etc.
	try {
		console.log(`load ${params.username}/${params.location}`);
		const { user } = await locals.validateUser();
		if (!user || user.username !== params.username) {
			throw redirect(302, `/u:${params.username}`);
		}
		const take = parseInt(url.searchParams.get('limit') || '20');
		const location = params.location.toLowerCase() as Location | 'ALL';
		depends('app:annotations');
		depends('app:entries');

		// TODO: pick up here — entries should still be the main thing
		// const entries = await db.entry.findMany({
		// 	where: {
		// 		annotations: {
		// 			some: {
		// 				userId: user.id,
		// 			},
		// 		},
		// 	},
		// 	take,
		// 	include: {
		// 		_count: {
		// 			select: {
		// 				annotations: true,
		// 			},
		// 		},
		// 		annotations: {
		// 			where: {
		// 				userId: user.id,
		// 				state: {
		// 					is: {
		// 						type: location === 'ALL' ? undefined : location,
		// 					},
		// 				},
		// 			},
		// 		},
		// 	},
		// });
		const annotations = await db.annotation.findMany({
			orderBy: [
				{
					updatedAt: 'desc',
				},
				{
					sortOrder: 'asc',
				},
			],
			where: {
				// location: location === 'ALL' ? undefined : location,
				state: {
					is: {
						type: location === 'ALL' ? undefined : location,
					},
				},
				userId: user.id,
				type: 'bookmark',
			},
			include: annotationExtendedInclude,
			take,
			// select: ArticleListSelect,
		});
		return {
			annotations,
			location,
			// entries,
		};
	} catch (e) {
		console.error(e);
		throw error(400, 'error fetching articles');
	}
};
