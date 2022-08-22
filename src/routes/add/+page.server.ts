// endpoint to add urls, mainly used for bookmarklet

import { db } from '$lib/db';
import type { PageServerLoad, Action } from './$types';
import dayjs from 'dayjs';
import parse from './_parse';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const _url = url.searchParams.get('url');
	const title = url.searchParams.get('title');
	const description = url.searchParams.get('description');
	const html = url.searchParams.get('html');
	return {
		title,
		description,
		html,
		url: _url
	};
};

export const POST: Action = async ({ request }) => {
	// todo: handle image requests and such
	const form = await request.formData();
	const url = <string>form.get('url') || <string>form.get('text');
	const title = <string>form.get('title');
	const html = <string>form.get('html');
	const contextUrl = <string | undefined>form.get('context-url');
	try {
		const article = await parse(url, html || undefined);
		// console.log({ article });
		let context;
		if (contextUrl) {
			console.log('got context');
			context = {
				connectOrCreate: {
					where: {
						url: contextUrl
					},
					create: {
						url: contextUrl
					}
				}
			};
			console.log({ context });
		}
		const newArticle = await db.article.upsert({
			where: {
				url
			},
			update: {
				...article,
				author: article.author || '',
				image: article.image || '',
				date: dayjs(article.date).isValid() ? dayjs(article.date).format() : dayjs().format()
			},
			create: {
				...article,
				url,
				title: title || article.title || '',
				author: article.author || '',
				image: article.image || '',
				date: dayjs(article.date).isValid() ? dayjs(article.date).format() : dayjs().format(),
				readProgress: 0,
				context
			}
		});
		if (newArticle) {
			return {
				location: `/article/${newArticle.id}`
			};
		}
	} catch (e) {
		console.log(e);
		throw error(400);
	}
};
