import { getJsonFromRequest } from '$lib/utils';
import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { Md5 } from 'ts-md5';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { timestamp, id, url, guid } = z
			.object({
				// itunes id
				id: z.string(),
				// todo: one of these two
				url: z.string().optional(),
				guid: z.string().optional(),
				timestamp: z.number(),
			})
			.refine((c) => !!c.url || !!c.guid, {
				message: 'must have either url or guid',
			})
			.parse(await getJsonFromRequest(request));

		const hash = Md5.hashStr(id + guid || url);
		await db.podcastEpisode.upsert({
			where: {
				hash,
			},
			update: {
				PodcastEpisodeInteraction: {
					upsert: {
						where: {
							hash,
						},
						update: {
							timestamp,
						},
						create: {
							hash,
							timestamp,
						},
					},
				},
			},
			create: {
				hash,
				podcastId: id,
				guid,
				url,
				PodcastEpisodeInteraction: {
					connectOrCreate: {
						where: {
							hash,
						},
						create: {
							hash,
							timestamp,
						},
					},
				},
			},
		});
		return new Response(null, { status: 200 });
	} catch (e) {
		console.error(e);
		throw error(400, e.message);
	}
};
