import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url, parent }) => {
	console.log(`loading ${url.pathname}`);
	const { user } = await locals.validateUser();
	const AUTHORIZED = user && user.username === params.username;
	if (AUTHORIZED) {
		//TODO: make this customizable or make this a better default home of showing all (maybe non-archived?)
		throw redirect(307, `/u:${params.username}/inbox`);
	}

	const take = parseInt(url.searchParams.get('limit') || '20');
	// load public version
	// two ways to think abuot this:
	// 1) either fetch all articles from user, then filter them in client
	// 2) fetch only requested articles from user (and maybe filter them in server)
	try {
		const user = await db.user.findUniqueOrThrow({
			where: {
				username: params.username,
			},
			select: {
				articles: {
					orderBy: [
						{
							createdAt: 'desc',
						},
					],
					take,
					select: ArticleListSelect,
					where: {
						private: false,
					},
				},
				username: true,
			},
		});

		// const tags = user.articles.flatMap((article) => article.tags);
		return {
			...user,
			// allTags: tags,
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'User not found');
	}
};

export const actions: Actions = {
	follow: async ({ locals, params }) => {
		//todo: explicit follows table in schema
		console.log(`follow ${params.username}`);
		const session = await locals.validate();
		if (!session) {
			throw error(401, 'Unauthorized');
		}
		const user = await db.user.update({
			where: {
				id: session.userId,
			},
			data: {
				following: {
					connect: {
						username: params.username,
					},
				},
			},
		});
		console.log(`[FOLLOW]`, { user });
		return {
			success: true,
		};
	},
	unfollow: async ({ locals, params }) => {
		console.log(`unfollow ${params.username}`);
		const session = await locals.validate();
		if (!session) {
			throw error(401, 'Unauthorized');
		}
		const user = await db.user.update({
			where: {
				id: session.userId,
			},
			data: {
				following: {
					disconnect: {
						username: params.username,
					},
				},
			},
		});
		console.log(`[UNFOLLOW]`, { user });
		return {
			success: true,
		};
	},
};
