import { json } from '@sveltejs/kit';
import { reportZodOrPrismaError } from '$lib/api-utils';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';

import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { tagRegex } from './_tag-constants';

export const GET: RequestHandler = async () => {
	const tags = await db.tag.findMany({
		where: {
			articles: {
				some: {}
			}
		}
	});
	return json(tags);
};

export const PATCH: RequestHandler = async ({ request, url }) => {
	console.log('patching!');
	const idsSchema = z.array(z.number()).nonempty();
	const tagSchema = z.string().regex(tagRegex).array();
	try {
		const data = await getJsonFromRequest(request);
		console.log({ data });
		const tags = tagSchema.parse(data.tags);
		const ids = idsSchema.parse(data.ids || data.id);
		console.log({ tags, ids });
		// is this an anti-pattern to use prisma.article instead of prisma.tag?
		const updatedArticles = await db.$transaction(
			ids.map((id) => {
				return db.article.update({
					where: {
						id
					},
					data: {
						tags: {
							set: tags.map((tag) => {
								return {
									name: tag
								};
							})
						}
					},
					include: {
						tags: true
					}
				});
			})
		);
		return json({
			articles: updatedArticles
		});
	} catch (e) {
		return json(
			{
				error: reportZodOrPrismaError(e)
			},
			{
				status: 400
			}
		);
	}
};
