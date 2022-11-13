import { error, json, type RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';
import type { Prisma } from '@prisma/client';
const selectionLookup = {
	articles: ArticleListSelect,
	favorites: {
		tag: true,
	},
};
export const GET: RequestHandler = async ({ request, url, locals }) => {
	console.log('Received fetch user data request');
	const fields = url.searchParams.get('data')?.split(',');
	let select: Prisma.UserSelect;
	if (fields && fields.length) {
		select = {
			...fields.reduce((acc, field) => {
				if (selectionLookup[field]) {
					acc[field] = {
						select: selectionLookup[field],
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
			favorites: {
				select: selectionLookup.favorites,
			},
			articles: {
				select: ArticleListSelect,
			},
		};
	}
	try {
		const session = await locals.getSession();
		// TODO: this should work but it doesn't
		// const { session, user } = await locals.getSessionUser();
		console.log({ session });
		if (!session) {
			throw error(401, 'Unauthorized');
		}
		const userData = await db.user.findFirst({
			//todo: is this the best way to do this?
			where: {
				email: session.userId,
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
