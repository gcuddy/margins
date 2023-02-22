// endpoint to add urls, mainly used for bookmarklet

import { DocumentType } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';

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
		// todo: handle image requests and such
		try {
			const form = await request.formData();
			const url = <string>form.get('url') || <string>form.get('text');
			const type = form.get('type') as DocumentType;
			console.log({ url })
			if (!url) {
				return fail(400, {
					url,
					missing: true,
				});
			}
			const state = form.get("state") as string || "";
			const serverRouter = appRouter.createCaller(await createContext(event))
			// TODO: differentiate between different types of links
			// First parse the article
			const article = await serverRouter.public.parse(url);
            // ^^ this should be stored in the cache!
			console.log(`here's the article we're going to try to add:`, { article })
			// Now add the article
			let screenshot: string | undefined = undefined
			if (type === "bookmark") {
				// get screenshot
				screenshot = await serverRouter.public.generateScreenshot({
					url
				});
				console.log({ screenshot })
			}
			const bookmark = await serverRouter.bookmarks.add({
				article: {
					...article,
					screenshot,
					type
				},
				url,
				stateId: state ? +(state) : undefined
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
