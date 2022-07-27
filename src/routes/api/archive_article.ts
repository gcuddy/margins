import { getJsonFromRequest } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/db';
const schema = z.object({
	id: z.number().or(z.string()),
	trash: z.boolean().optional()
});

export const POST: RequestHandler = async ({ request, params }) => {
	const json = await getJsonFromRequest(request);
	try {
		const { id, trash } = schema.parse(json);
		// TODO: use soft delete i.e. https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware#can-i-add-a-global-includedeleted-to-the-post-model
		// Then set script to delete after 2 weeks - use Google Cloud Function? (thn i would need to mark date, would i not? or just use last updated?)
		// can i just do it from here? i guess middleware would "hard code" it in so i don't accidentally delete something

		const article = await db.article.update({
			where: {
				id: Number(id)
			},
			data: {
				location: 'ARCHIVE',
				trash: trash ? true : false
			},
			select: {
				updatedAt: true
			}
		});

		// TODO: headers
		return {
			status: 200,
			body: article
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400
		};
	}
};
