// endpoint to add urls, mainly used for bookmarklet

import { DocumentType } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';

import { db } from '$lib/db';
import { connectOrCreateTaggings } from '$lib/tag.server';
import { createContext } from '$lib/trpc/context';
import { appRouter } from '$lib/trpc/router';

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
	default: async (event) => {
		const { request, locals, fetch } = event;
		console.log({ locals });
		// todo: handle image requests and such
		try {
			const form = await request.formData();
			const url = <string>form.get('url') || <string>form.get('text');
			if (!url) {
				return fail(400, {
					url,
					missing: true,
				});
			}
			const serverRouter = appRouter.createCaller(await createContext(event))
			// TODO: differentiate between different types of links
			// First parse the article
			const article = await serverRouter.public.parse(url);
			console.log(`here's the article we're going to try to add:`, { article })
			// Now add the article
			const bookmark = await serverRouter.bookmarks.add({
				article,
				url,
			})
			console.log(`result of /add`, { bookmark })
			if (bookmark) {
				return {
					// location: `/u:${}/article/${newArticle.id}`,
					bookmark,
				};
			}
		} catch (e) {
			console.error(e);
			throw error(400);
		}
	},
};
