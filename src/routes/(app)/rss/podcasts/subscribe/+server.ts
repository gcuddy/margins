import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getJsonFromRequest } from '$lib/utils';
import { z } from 'zod';
import { db } from '$lib/db';
import { auth } from '$lib/lucia';
const RssFeedModel = z.object({
	id: z.number().int().optional(),
	itunes_id: z.string().optional(),
	feedUrl: z.string(),
	title: z.string().nullish(),
	link: z.string().nullish(),
	description: z.string().nullish(),
	lastBuildDate: z.date().nullish(),
	imageUrl: z.string().nullish(),
	creator: z.string().nullish(),
});
export const POST: RequestHandler = async ({ request, locals }) => {
	console.log({ locals });
	// TODO: typing for locals
	if (!locals.lucia) throw error(401, 'unauthorized');
	try {
		console.log({ locals });
		const { refresh_token } = locals.lucia;
		const json = await getJsonFromRequest(request);
		const data = RssFeedModel.parse(json);

		// can I do this? is this bad practice?? maybe????
		await db.refreshToken.update({
			where: {
				refresh_token,
				// etc, to get user
			},
			data: {
				user: {
					update: {
						feeds: {
							connectOrCreate: {
								where: {
									itunes_id: data.itunes_id,
								},
								create: {
									feedUrl: data.feedUrl,
									title: data.title,
									description: data.description,
									imageUrl: data.imageUrl,
									creator: data.creator,
									podcast: true,
									itunes_id: data.itunes_id,
								},
							},
						},
					},
				},
			},
		});
		// const user = auth.validateRequest(request);
		//TODO: user interaction
		// await db.user.update({
		//     where: {
		//         id: loc
		//     }
		// })
		// await db.rssFeed.create({
		// 	data: {
		// 		feedUrl: data.feedUrl,
		// 		title: data.title,
		// 		description: data.description,
		// 		imageUrl: data.imageUrl,
		// 		creator: data.creator,
		// 		podcast: true,
		// 	},
		// });
		return new Response(undefined, { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 400 });
	}
};
