import { annotationSchema } from '$lib/annotation';
import { books } from '$lib/api/gbook';
import pindex from '$lib/api/pindex';
import { tmdb } from '$lib/api/tmdb';
import dayjs from '$lib/dayjs';
import { db, json } from '$lib/db';
import { bookmarkSchema, tagSchema, updateBookmarkSchema } from '$lib/features/entries/forms';
import { nanoid } from '$lib/nanoid';
import type { Entry } from '$lib/prisma/kysely/types';
import { interactionSchema, validateAuthedForm } from '$lib/schemas';
import type { Message, Type } from '$lib/types';
import { fail } from '@sveltejs/kit';
import type { Insertable } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import spotify from '$lib/api/spotify';
import { getFirstBookmarkSort } from '$lib/db/selects';
import { upsertAnnotation } from '$lib/queries/server';
import { Tweet, tweet_types } from '$lib/api/twitter';
import { z } from 'zod';
import { validate_form } from '$lib/utils/forms';
import { relationSchema, update_relation } from '$lib/server/mutations';

export async function load() {
    const tagForm = await superValidate(tagSchema);
    return {
        tagForm
    }
}


export const actions: Actions = {
	updateBookmark: async (e) => {
		const { request, params, locals } = e;
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const form = await superValidate<typeof updateBookmarkSchema, Message>(
			request,
			updateBookmarkSchema,
			{ id: 'update' }
		);
		console.log({ form });
		if (!form.valid) {
			return fail(400, { update: form });
		}
		const { status } = form.data;
		await db
			.updateTable('Bookmark')
			.where('entryId', '=', +params.id)
			.where('userId', '=', session.userId)
			.set({
				status
			})
			.execute();
		return message(form, {
			status: 'success',
			text: status ? `Status updated to ${status}` : undefined
		});
	},
	bookmark: async ({ request, params, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		let { type } = params;
		type = type.toLowerCase();
		const bookmarkForm = await superValidate(request, bookmarkSchema, { id: 'bookmark' });

		let entryId = type === 'entry' ? +params.id : bookmarkForm.data.entryId;

		if (!entryId) {
			// then we need to create the entry first
			const { entryId: _entryId, id, ...data } = bookmarkForm.data;
			// TODO: get tmdb or googlebooks data or whatever...

			let insertable: Insertable<Entry> = {
				updatedAt: new Date(),
				...data
			};

			if ((type === 'movie' || type === 'tv') && data.tmdbId) {
				if (type === 'tv') {
					const tv = await tmdb.tv.details(data.tmdbId);
					insertable = {
						...insertable,
						title: tv.name,
						text: tv.overview,
						uri: `tmdb:tv:${tv.id}`,
						tmdbId: tv.id,
						author: tv.created_by?.map((val) => val.name).join(', '),
						published: tv.first_air_date,
						image: tmdb.media(tv.poster_path),
						type: 'tv'
					};
				} else {
					const movie = await tmdb.movie.details(data.tmdbId);
					insertable = {
						...insertable,
						title: movie.title,
						html: movie.overview,
						uri: `tmdb:${movie.id}`,
						tmdbId: movie.id,
						author: movie.credits?.crew?.find((c) => c.job === 'Director')?.name,
						published: movie.release_date,
						image: tmdb.media(movie.poster_path),
						type: 'movie'
					};
				}
			} else if (type === 'book' && data.googleBooksId) {
				const book = await books.get(data.googleBooksId);
				console.log({ book });
				let image = book.volumeInfo.imageLinks?.thumbnail;
				if (image) {
					const u = new URL(image);
					u.searchParams.delete('edge');
					image = u.toString();
				}

				insertable = {
					...insertable,
					title: book.volumeInfo.title,
					html: book.volumeInfo.description,
					uri: `isbn:${
						book.volumeInfo.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier
					}`,
					googleBooksId: book.id,
					author: book.volumeInfo.authors?.join(', '),
					published: dayjs(book.volumeInfo.publishedDate).toDate(),
					image,
					type: 'book',
					publisher: book.volumeInfo.publisher,
					pageCount: book.volumeInfo.pageCount
				};
			} else if (type === 'podcast' && data.podcastIndexId) {
				//todo
				const { episode } = await pindex.episodeById(Number(data.podcastIndexId));
				insertable = {
					...insertable,
					title: episode.title,
					text: episode.description,
					uri: episode.enclosureUrl,
					podcastIndexId: BigInt(episode.id),
					published: new Date(episode.datePublished * 1000),
					type: 'podcast',
					image: episode.image || episode.feedImage
				};
			} else if (type === 'album' && data.spotifyId) {
				const album = await spotify.album(data.spotifyId);
				insertable = {
					...insertable,
					title: album.name,
					uri: `spotify:album:${album.id}`,
					spotifyId: album.id,
					image: album.images[0].url,
					author: album.artists.map((a) => a.name).join(', '),
					published: new Date(album.release_date),
					type: 'album'
				};
			}
			const entry = await db.insertInto('Entry').values(insertable).executeTakeFirst();
			entryId = Number(entry.insertId);
		}
		console.log({ bookmarkForm });
		if (bookmarkForm.data.id) {
			// then delete
			await db.deleteFrom('Bookmark').where('id', '=', bookmarkForm.data.id).execute();
			return message(bookmarkForm, 'Bookmark deleted');
		} else {
			// then create
			await db
				.insertInto('Bookmark')
				.values({
					updatedAt: new Date(),
					entryId,
					userId: session.userId,
					sort_order: await getFirstBookmarkSort(session.userId)
				})
				.execute();
			return message(bookmarkForm, 'Bookmark created');
		}
		// return {
		//     bookmarkForm
		// }
	},
	annotate: async ({ request, params, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const annotationForm = await superValidate(request, annotationSchema, { id: 'annotation' });
		let annotation = annotationForm.data;
		annotation.userId = session.userId;
		const id = await upsertAnnotation(annotation);
		annotationForm.data.id = id;
		return message(annotationForm, 'Annotation saved');
	},
	deleteAnnotation: async ({ request, params, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const data = await request.formData();
		const id = data.get('id');
		if (!id) {
			return fail(400);
		}
		await db
			.deleteFrom('Annotation')
			.where('userId', '=', session.userId)
			.where('id', '=', String(id))
			.execute();
		return { succcess: true };
	},
	tag: async ({ request, params, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const tagForm = await superValidate(request, tagSchema, { id: 'tag' });
		console.dir(
			{ tagForm },
			{
				depth: null
			}
		);
		if (!tagForm.valid) {
			return fail(400, { tagForm });
		}

		// then we have an array of tags
		const tagsToAdd = tagForm.data.tags.filter((tag) => !tag.id);
		const tagIds = tagForm.data.tags
			.filter((tag) => tag.id)
			.map((tag) => tag.id)
			.filter(Boolean);
		console.log({ tagsToAdd, existingTagIds: tagIds });
		if (!tagIds.length) {
			// then delete all existing tags on this entry
			await db.deleteFrom('TagOnEntry').where('entryId', '=', +params.id).execute();
			return message(tagForm, 'Tags updated');
		}
		// if (tagsToAdd.length) {
		//     await db.insertInto("Tag")
		//         .values(tagsToAdd.map(tag => ({
		//             name: tag.name,
		//             userId: session.userId,
		//         })))
		//         .execute();

		//     // get ids of new tags
		//     const newTags = await db.selectFrom("Tag")
		//         .select(["id"])
		//         .where("userId", "=", session.userId)
		//         .where("name", "in", tagsToAdd.map(tag => tag.name))
		//         .execute();

		//     existingTagIds = [...existingTagIds, ...newTags.map(tag => tag.id)]
		// }
		// now update tag on entry
		const q = await db
			.insertInto('TagOnEntry')
			.values(
				tagIds.map((tagId) => ({
					entryId: +params.id,
					tagId,
					userId: session.userId
				}))
			)
			.ignore()
			.execute();
		console.dir({ q }, { depth: null });
		// now delete tags that are no longer there
		await db
			.deleteFrom('TagOnEntry')
			.where('entryId', '=', +params.id)
			.where('tagId', 'not in', tagIds)
			.execute();

		// TODO: use string ids to make this more efficient
		return message(tagForm, 'Tags added');

		// old version below that wanted tags array - this just wants a
		// // filter tags without ids to add them
		// const tagsToAdd = tagForm.data.tags.filter(tag => !tag.id);
		// const existingTagIds = tagForm.data.tags.filter(tag => tag.id).map(tag => tag.id).filter(Boolean)

		// // add new tags
		// if (tagsToAdd.length) {
		//     console.log({ tagsToAdd })
		//     await db.insertInto("Tag")
		//         .values(tagsToAdd.map(tag => ({
		//             name: tag.name,
		//             userId: session.userId,
		//         })))
		//         .execute();
		// }

		// // get existing tags? (or should this come from client?)
		// const existingTags = await db.selectFrom("Tag as t")
		//     .innerJoin("TagOnEntry as toe", "toe.tagId", "t.id")
		//     .select(["t.id", "t.name", "toe.id as toe_id"])
		//     .where("toe.entryId", "=", +params.id)
		//     .execute();

		// const tagsToRemove = existingTags.filter(tag => !existingTagIds.includes(tag.id));
		// if (tagsToRemove.length) {
		//     // remove old tags
		//     console.log("tagsToRemove", tagsToRemove)
		//     const tagIdsToRemove = tagsToRemove.map(tag => tag.id);
		//     await db.deleteFrom("TagOnEntry")
		//         .where("entryId", "=", +params.id)
		//         .where("tagId", "in", tagIdsToRemove)
		//         .execute();
		// }

		// // New tags:

		// // now update tag on entries

		// const tags = tagForm.data.tags.map(tag => ({
		//     name: tag.name,
		//     id: tag.id ?? nanoid(),
		//     userId: session.userId,
		// }) as const)
		// // await db.insertInto("Tag")
		// //     .values(tags)
	},
	createTag: async ({ request, url, params, locals }) => {
		console.log({ request, url, search: url.search });

		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const name = url.searchParams.get('name');
		if (name) {
			const q = await db
				.insertInto('Tag')
				.values({
					name,
					userId: session.userId
				})
				.executeTakeFirstOrThrow();
			const id = Number(q.insertId);
			await db
				.insertInto('TagOnEntry')
				.values({
					entryId: +params.id,
					tagId: id,
					userId: session.userId
				})
				.execute();
			// return message({ id, name }, "Tag created")
			// return {
			//     id,
			//     name,
			// }
		}
	},
	interaction: validateAuthedForm(
		interactionSchema,
		{
			id: 'interaction'
		},
		async ({ form, session }) => {
			console.log({ form });
			await db
				.insertInto('EntryInteraction')
				.values({
					...form.data,
					userId: session.userId,
					updatedAt: new Date()
				})
				.onDuplicateKeyUpdate(form.data)
				.execute();
			return { interactionForm: form };
		}
	),
	relation: async ({ locals, request, params }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		const data = await request.formData();
		const id = data.get('id');
		if (id) {
			// delete
			await db.deleteFrom('Relation').where('id', '=', String(id)).execute();
			return;
		}
		const entryId = +params.id;
		const parsed = relation_schema.safeParse(Object.fromEntries(data));
		console.dir(
			{
				parsed
			},
			{
				depth: null
			}
		);
		if (!parsed.success) return fail(400, parsed.error.flatten().fieldErrors);
		const { relatedEntryId, type } = parsed.data;
		await db
			.insertInto('Relation')
			.values({
				entryId,
				relatedEntryId,
				type,
				updatedAt: new Date(),
				userId: session.userId,
				id: nanoid()
			})
			.onDuplicateKeyUpdate({
				updatedAt: new Date(),
				type
			})
			.execute();
	},
	update_relation: validate_form(relationSchema, async ({ data }) => {
		await update_relation(data);
	})
};

const relation_schema = z.object({
	relatedEntryId: z.coerce.number().int(),
	type: z.enum(['Related', 'SavedFrom', 'Grouped']).default('Related').optional()
});
