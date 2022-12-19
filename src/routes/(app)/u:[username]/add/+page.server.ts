// endpoint to add urls, mainly used for bookmarklet

import { DocumentType } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import dayjs from 'dayjs';

import { db } from '$lib/db';
import parse from '$lib/parse';

import type { Actions, PageServerLoad } from './$types';

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
			const { userId } = await locals.validate();
			console.log({ userId });
			const form = await request.formData();
			const url = <string>form.get('url') || <string>form.get('text');
			if (!url) {
				return fail(400, {
					url,
					missing: true,
				});
			}
			const note = <string>form.get('note');
			const title = <string>form.get('title');
			const html = <string>form.get('html');
			const tags = <string[]>form.getAll('tags[]');
			const _private = <string>form.get('private');
			console.log({ _private });
			const location = <string>form.get('location');
			const readLater = <string>form.get('readLater');
			console.log({ tags, note });
			const contextUrl = <string | undefined>form.get('context-url');
			const article = await parse(url, html || undefined);
			console.log({ article });
			let context;
			await db.entry.upsert({
				data: {
					...article,
					type: DocumentType.article,
					uri: url,
				},
				where: {},
			});
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
					private: _private === 'on',
					location,
					readLater: readLater === 'on',
					tags: tags.length
						? {
								connectOrCreate: tags.map((t) => {
									return {
										where: {
											name_userId: {
												name: t,
												userId,
											},
										},
										create: {
											name: t,
											userId,
										},
									};
								}),
						  }
						: undefined,
					annotations: !note
						? undefined
						: {
								create: {
									target: JSON.stringify({
										source: url,
									}),
									motivation: 'describing',
									body: note,
								},
						  },
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
