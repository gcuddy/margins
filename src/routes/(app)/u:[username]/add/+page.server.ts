// endpoint to add urls, mainly used for bookmarklet

import { DocumentType } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';

import { db } from '$lib/db';
import { connectOrCreateTaggings } from '$lib/tag.server';

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
	default: async ({ request, locals, fetch }) => {
		console.log({ locals });
		// todo: handle image requests and such
		try {
			const { session, user } = await locals.validateUser();
			if (!session) {
				throw error(401);
			}
			const { userId } = session;
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
			const tags = <string[]>form.getAll('tags');
			const _private = <string>form.get('private');
			const location = <string>form.get('location');
			const readLater = <string>form.get('readLater');
			const contextUrl = <string | undefined>form.get('context-url');
			const article = await fetch(`/api/parse?url=${encodeURIComponent(url)}`).then((res) =>
				res.json()
			);
			console.log(`result of api/parse.json`, { article });
			// const article = await parse(url, html || undefined);
			let context;
			// TODO: normalize url
			const [entry, bookmark] = await db.$transaction([
				db.entry.upsert({
					where: {
						uri: url,
					},
					create: {
						...article,
						type: DocumentType.article,
						uri: url,
					},
					update: {
						...article,
						uri: url,
					},
				}),
				db.bookmark.upsert({
					where: {
						uri: url,
					},
					create: {
						data: article,
						interaction: {
							connectOrCreate: {
								where: {
									userId_uri: {
										uri: url,
										userId,
									},
								},
								create: {
									userId,
									uri: url,
								},
							},
						},
						tags: {
							connectOrCreate: connectOrCreateTaggings({ tags, userId }),
						},
						annotations: note
							? {
									create: {
										type: 'note',
										userId,
										body: note,
									},
							  }
							: undefined,
						entry: {
							connect: {
								uri: url,
							},
						},
						user: {
							connect: {
								id: userId,
							},
						},
						state: {
							connect: {
								id: user.default_state_id,
							},
						},
					},
					update: {
						data: article,
					},
				}),
			]);
			console.log({ entry, bookmark });
			// const bookmark = await db.annotation.upsert({
			//     where: {

			//     }
			// })
			// const newArticle = await db.article.create({
			// 	data: {
			// 		...article,
			// 		url,
			// 		title: title || article.title || '',
			// 		author: article.author || '',
			// 		image: article.image || '',
			// 		date: dayjs(article.date).isValid() ? dayjs(article.date).format() : dayjs().format(),
			// 		readProgress: 0,
			// 		context,
			// 		type: 0,
			// 		userId,
			// 		private: _private === 'on',
			// 		location,
			// 		readLater: readLater === 'on',
			// 		tags: tags.length
			// 			? {
			// 					connectOrCreate: tags.map((t) => {
			// 						return {
			// 							where: {
			// 								name_userId: {
			// 									name: t,
			// 									userId,
			// 								},
			// 							},
			// 							create: {
			// 								name: t,
			// 								userId,
			// 							},
			// 						};
			// 					}),
			// 			  }
			// 			: undefined,
			// 		annotations: !note
			// 			? undefined
			// 			: {
			// 					create: {
			// 						target: JSON.stringify({
			// 							source: url,
			// 						}),
			// 						motivation: 'describing',
			// 						body: note,
			// 					},
			// 			  },
			// 	},
			// });
			if (entry) {
				return {
					// location: `/u:${}/article/${newArticle.id}`,
					entry,
				};
			}
		} catch (e) {
			console.log({ e });
			throw error(400);
		}
	},
};
