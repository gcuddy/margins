import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
export const actions: Actions = {
	default: async ({ request, params }) => {
		const session = await auth.validateRequest(request);
		const { url, image, date, title } = await getJsonFromRequest(request);
		// TODO: link to podcast better
		console.log({ url, image, date, title });
		await db.article.create({
			data: {
				title,
				url,
				user: {
					connect: {
						id: session.userId,
					},
				},
				image,
				date,
				type: 1,
				// feedItem: {
				// 	connectOrCreate: {
				// 		where: {
				//             uuid: params.episode_uuid,
				//         },
				//         create: {

				//         }
				// 	},
				// },
			},
		});
	},
};
