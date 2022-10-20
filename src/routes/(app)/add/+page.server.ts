// endpoint to add urls, mainly used for bookmarklet

import { db } from '$lib/db';
import type { PageServerLoad, Action, Actions } from './$types';
import dayjs from 'dayjs';
import parse from '$lib/parse';
import { error } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ url }) => {
	const _url = url.searchParams.get('url');
	const title = url.searchParams.get('title');
	const description = url.searchParams.get('description');
	const html = url.searchParams.get('html');
	return {
		title,
		description,
		html,
		url: _url,
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		console.log({ locals });
		// todo: handle image requests and such
		try {
			const { userId } = locals.getSession();
			console.log({ userId });
			const form = await request.formData();
			const url = <string>form.get('url') || <string>form.get('text');
			const title = <string>form.get('title');
			const html = <string>form.get('html');
			const contextUrl = <string | undefined>form.get('context-url');
			const article = await parse(url, html || undefined);
			console.log({ article });
			let context;
			const newArticle = await db.article.create({
				data: {
					...article,
					url,
					title: title || article.title || '',
					author: article.author || '',
					image: article.image || '',
					date: dayjs(article.date).isValid() ? dayjs(article.date).format() : dayjs().format(),
					readProgress: 0,
					context,
					type: 0,
					userId,
				},
			});
			if (newArticle) {
				return {
					location: `/article/${newArticle.id}`,
				};
			}
		} catch (e) {
			console.log({ e });
			throw error(400);
		}
	},
};
