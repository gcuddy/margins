import { error, json, type RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';
import type { Prisma } from '@prisma/client';
export const GET: RequestHandler = async ({ request, url, locals }) => {
	console.log('Received fetch user data request');
	const fields = url.searchParams.get('data')?.split(',');
	let select: Prisma.UserSelect;
	if (fields && fields.length) {
		select = {
			...fields.reduce((acc, field) => {
				if (field === 'articles') {
					acc[field] = {
						select: ArticleListSelect,
					};
				} else {
					acc[field] = true;
				}
				return acc;
			}, {} as Prisma.ArticleSelect),
		};
	} else {
		select = {
			email: true,
			feeds: true,
			favorites: true,
			articles: {
				select: ArticleListSelect,
			},
		};
	}
	try {
		const session = locals.getSession();
		if (!session) {
			throw error(401, 'Unauthorized');
		}
		const { userId } = await auth.validateRequest(request);
		const userData = await db.user.findFirst({
			where: {
				id: userId,
			},
			select,
		});
		if (!userData) {
			throw error(400, 'User not found');
		}
		return json(userData);
	} catch (e) {
		console.error(e);
		throw error(401, 'unauthorized');
	}
};
