import { fail, redirect } from '@sveltejs/kit';
import type { Insertable } from 'kysely';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { annotationSchema } from '$lib/annotation';
import { books } from '$lib/api/gbook';
import pindex from '$lib/api/pindex';
import spotify from '$lib/api/spotify';
import { tmdb } from '$lib/api/tmdb';
import dayjs from '$lib/dayjs';
import { db } from '$lib/db';
import {
	saveInteraction,
	saveInteractionSchema,
} from '$lib/db/queries/interaction';
import { getFirstBookmarkSort } from '$lib/db/selects';
import {
	bookmarkSchema,
	tagSchema,
	updateBookmarkSchema,
} from '$lib/features/entries/forms';
import { nanoid } from '$lib/nanoid';
import type { Entry } from '$lib/prisma/kysely/types';
import {
	SaveToLibrarySchema,
	createEntry,
	save_to_library,
	upsertAnnotation,
} from '$lib/queries/server';
import { interactionSchema, validateAuthedForm } from '$lib/schemas';
import { relationSchema, update_relation } from '$lib/server/mutations';
import type { Message, Type } from '$lib/types';
import { validate_form } from '$lib/utils/forms';

import type { Actions } from './$types';
import { getIdKeyName, isMediaType, makeMediaSchema } from '$lib/utils/entries';
import { interactionLogInputSchema } from '$components/entries/interaction-form/schema';
import { saveToLibrarySchema } from '$lib/schemas/inputs/entry.schema';

export async function load(event) {
	const { locals, params } = event;
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
	}
	const { id, type: _type } = params;
	const type = _type as Type;
	const entry = {
		entryId: id,
		type,
	};
	return {
		bookmarkForm: superValidate(updateBookmarkSchema),
		saveToLibraryForm: superValidate(entry, saveToLibrarySchema),
		tagForm: superValidate(tagSchema),
		session,
	};
}

export const actions: Actions = {
	annotate: async ({ locals, params, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const annotationForm = await superValidate(request, annotationSchema, {
			id: 'annotation',
		});
		const annotation = annotationForm.data;
		annotation.userId = session.user.userId;
		const id = await upsertAnnotation(annotation);
		annotationForm.data.id = id;
		return message(annotationForm, 'Annotation saved');
	},
	bookmark: async ({ locals, params, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		let { type } = params;
		type = type.toLowerCase();
		const bookmarkForm = await superValidate(request, bookmarkSchema, {
			id: 'bookmark',
		});

		let entryId = type === 'entry' ? +params.id : bookmarkForm.data.entryId;

		if (!entryId) {
			// then we need to create the entry first
			const { entryId: _entryId, id, ...data } = bookmarkForm.data;
			// TODO: get tmdb or googlebooks data or whatever...

			let insertable: Insertable<Entry> = {
				updatedAt: new Date(),
				...data,
			};

			if ((type === 'movie' || type === 'tv') && data.tmdbId) {
				if (type === 'tv') {
					const tv = await tmdb.tv.details(data.tmdbId);
					insertable = {
						...insertable,
						author: tv.created_by?.map((val) => val.name).join(', '),
						image: tmdb.media(tv.poster_path),
						published: tv.first_air_date,
						text: tv.overview,
						title: tv.name,
						tmdbId: tv.id,
						type: 'tv',
						uri: `tmdb:tv:${tv.id}`,
					};
				} else {
					const movie = await tmdb.movie.details(data.tmdbId);
					insertable = {
						...insertable,
						author: movie.credits?.crew?.find((c) => c.job === 'Director')
							?.name,
						html: movie.overview,
						image: tmdb.media(movie.poster_path),
						published: movie.release_date,
						title: movie.title,
						tmdbId: movie.id,
						type: 'movie',
						uri: `tmdb:${movie.id}`,
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
					author: book.volumeInfo.authors?.join(', '),
					googleBooksId: book.id,
					html: book.volumeInfo.description,
					image,
					pageCount: book.volumeInfo.pageCount,
					published: dayjs(book.volumeInfo.publishedDate).toDate(),
					publisher: book.volumeInfo.publisher,
					title: book.volumeInfo.title,
					type: 'book',
					uri: `isbn:${book.volumeInfo.industryIdentifiers?.find(
						(i) => i.type === 'ISBN_13',
					)?.identifier}`,
				};
			} else if (type === 'podcast' && data.podcastIndexId) {
				//todo
				const { episode } = await pindex.episodeById(
					Number(data.podcastIndexId),
				);
				insertable = {
					...insertable,
					image: episode.image || episode.feedImage,
					podcastIndexId: BigInt(episode.id),
					published: new Date(episode.datePublished * 1000),
					text: episode.description,
					title: episode.title,
					type: 'podcast',
					uri: episode.enclosureUrl,
				};
			} else if (type === 'album' && data.spotifyId) {
				const album = await spotify.album(data.spotifyId);
				insertable = {
					...insertable,
					author: album.artists.map((a) => a.name).join(', '),
					image: album.images[0].url,
					published: new Date(album.release_date),
					spotifyId: album.id,
					title: album.name,
					type: 'album',
					uri: `spotify:album:${album.id}`,
				};
			}
			const entry = await db
				.insertInto('Entry')
				.values(insertable)
				.executeTakeFirst();
			entryId = Number(entry.insertId);
		}
		console.log({ bookmarkForm });
		if (bookmarkForm.data.id) {
			// then delete
			await db
				.deleteFrom('Bookmark')
				.where('id', '=', bookmarkForm.data.id)
				.execute();
			return message(bookmarkForm, 'Bookmark deleted');
		} else {
			// then create
			await db
				.insertInto('Bookmark')
				.values({
					entryId,
					sort_order: await getFirstBookmarkSort(session.user.userId),
					updatedAt: new Date(),
					userId: session.user.userId,
				})
				.execute();
			return message(bookmarkForm, 'Bookmark created');
		}
		// return {
		//     bookmarkForm
		// }
	},
	createTag: async ({ locals, params, request, url }) => {
		console.log({ request, search: url.search, url });

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
					userId: session.user.userId,
				})
				.executeTakeFirstOrThrow();
			const id = Number(q.insertId);
			await db
				.insertInto('TagOnEntry')
				.values({
					entryId: +params.id,
					tagId: id,
					userId: session.user.userId,
				})
				.execute();
			// return message({ id, name }, "Tag created")
			// return {
			//     id,
			//     name,
			// }
		}
	},
	deleteAnnotation: async ({ locals, params, request }) => {
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
			.where('userId', '=', session.user.userId)
			.where('id', '=', String(id))
			.execute();
		return { succcess: true };
	},
	interaction: validateAuthedForm(
		interactionSchema,
		{
			id: 'interaction',
		},
		async ({ form, session }) => {
			console.log({ form });
			await db
				.insertInto('EntryInteraction')
				.values({
					...form.data,
					updatedAt: new Date(),
					userId: session.user.userId,
				})
				.onDuplicateKeyUpdate(form.data)
				.execute();
			return { interactionForm: form };
		},
	),
	logInteraction: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, interactionLogInputSchema);
		const session = await event.locals.auth.validate();
		if (!form.valid) {
			return fail(400, { form });
		}
		if (!session) {
			return fail(401, { form });
		}

		console.dir({ form }, { depth: null });

		const _entryId = formData.get('_entryId');
		console.log({ _entryId });
		// _entryId is used to override entryId in form (for when entry already exists in media
		let entryId = _entryId
			? +_entryId
			: isMediaType(form.data.type)
			? (await createEntry(makeMediaSchema(form.data.entryId, form.data.type)))
					.id
			: Number(form.data.entryId);

		const { entryId: _, type: _type, revisit, ...data } = form.data;
		await db.transaction().execute(async (trx) => {
			await trx
				.insertInto('EntryInteraction')
				.values({
					// ...form.data,
					...data,
					revisit: revisit ? +revisit : undefined,
					entryId,
					updatedAt: new Date(),
					userId: session.user.userId,
				})
				.execute();

			// Update Bookmark
			return await trx
				.insertInto('Bookmark')
				.values({
					bookmarked_at: new Date(),
					rating: data.rating,
					status: 'Archive',
					updatedAt: new Date(),
					entryId,
					userId: session.user.userId,
				})
				.onDuplicateKeyUpdate({
					rating: data.rating,
					status: 'Archive',
					updatedAt: new Date(),
				})
				.execute();
		});
		return { form };
	},
	markAsCurrentlyReading: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, interactionLogInputSchema);
		const session = await event.locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		if (!form.valid) {
			return fail(400, { form });
		}

		const _entryId = formData.get('_entryId');

		const { entryId: _, revisit, ...data } = form.data;

		let entryId = _entryId
			? +_entryId
			: isMediaType(form.data.type)
			? (await createEntry(makeMediaSchema(form.data.entryId, form.data.type)))
					.id
			: Number(form.data.entryId);

		// Make/update interaction, set bookmark status to now

		// TODO: should this be a transaction?

		await db
			.insertInto('EntryInteraction')
			.values({
				...data,
				entryId,
				revisit: revisit ? +revisit : undefined,
				updatedAt: new Date(),
				userId: session.user.userId,
			})
			.execute();

		await db
			.insertInto('Bookmark')
			.values({
				bookmarked_at: new Date(),
				entryId,
				status: 'Now',
				updatedAt: new Date(),
				userId: session.user.userId,
			})
			.onDuplicateKeyUpdate({
				status: 'Now',
				updatedAt: new Date(),
			})
			.execute();

		return { form };
	},
	/**
	 * Marks entry as finished and moves bookmark to "Archive".
	 */
	markFinished: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const formData = await event.request.formData();
		// TODO: if not an entry yet, create it
		const entryId = formData.get('entryId');
		const historyId = formData.get('historyId') as string | undefined;
		if (typeof entryId !== 'string') {
			return fail(400);
		}
		await db
			.insertInto('EntryInteraction')
			.values({
				entryId: +entryId,
				finished: new Date(),
				progress: 1,
				seen: 1,
				updatedAt: new Date(),
				userId: session.user.userId,
			})
			.onDuplicateKeyUpdate({
				finished: new Date(),
				progress: 1,
				seen: 1,
				updatedAt: new Date(),
			})
			.execute();
		// TODO: should edit this if one exists on same day
		// TODO: should entryhistory just be intryinteraction?
		// await db
		// 	.insertInto('EntryHistory')
		// 	.values({
		// 		createdAt: new Date(),
		// 		entryId: +entryId,
		// 		finished: 1,
		// 		id: historyId ?? nanoid(),
		// 		updatedAt: new Date(),
		// 		userId: session.user.userId,
		// 	})
		// 	.execute();
		await db
			.insertInto('Bookmark')
			.values({
				entryId: +entryId,
				status: 'Archive',
				updatedAt: new Date(),
				userId: session.user.userId,
			})
			.onDuplicateKeyUpdate({
				status: 'Archive',
				updatedAt: new Date(),
			})
			.execute();
	},
	rate: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const formData = await event.request.formData();
		const rating = formData.get('rating');
		// const bookmarkId = formData.get('bookmarkId');
		let entryId = formData.get('entryId') as string | undefined;
		// TODO: if no entryid, create one given type and id
		console.log(event.params);
		let created = false;
		if (!entryId) {
			const key = getIdKeyName(event.params.type);
			const e = await createEntry({
				[key]: event.params.id,
				type: event.params.type,
			});
			console.log({ key });
			entryId = e.id;
			created = true;
		}
		console.log({ rating, entryId });
		if (
			typeof rating !== 'string' ||
			// typeof bookmarkId !== 'string' ||
			!entryId
		) {
			return fail(400);
		}
		await db
			.insertInto('Bookmark')
			.values({
				// bookmarked: 1,
				entryId: +entryId,
				// id: +bookmarkId,
				rating: +rating,
				status: 'Archive',
				updatedAt: new Date(),
				userId: session.user.userId,
			})
			.onDuplicateKeyUpdate({
				rating: +rating,
				updatedAt: new Date(),
			})
			.execute();
		return { created };
	},
	relation: async ({ locals, params, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
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
				parsed,
			},
			{
				depth: null,
			},
		);
		if (!parsed.success) {
			return fail(400, parsed.error.flatten().fieldErrors);
		}
		const { relatedEntryId, type } = parsed.data;
		await db
			.insertInto('Relation')
			.values({
				entryId,
				id: nanoid(),
				relatedEntryId,
				type,
				updatedAt: new Date(),
				userId: session.user.userId,
			})
			.onDuplicateKeyUpdate({
				type,
				updatedAt: new Date(),
			})
			.execute();
	},

	saveInteraction: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const formData = Object.fromEntries(await event.request.formData());
		const parsed = saveInteractionSchema.safeParse(formData);
		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			console.dir({ errors }, { depth: null });
			return fail(400, errors);
		}
		await saveInteraction({
			ctx: { event, userId: session.user.userId },
			input: parsed.data,
		});
	},
	saveToLibrary: async (event) => {
		const session = await event.locals.auth.validate();
		const formData = await event.request.formData();
		const form = await superValidate(formData, saveToLibrarySchema);
		console.dir({ form }, { depth: null });
		if (!form.valid) {
			return fail(400, { form });
		}
		if (!session) {
			return fail(401, { form });
		}

		if (form.data.bookmarkId && form.data.bookmarked_at) {
			// then remove bookmarked flag
			await db
				.updateTable('Bookmark')
				.where('id', '=', form.data.bookmarkId)
				.set({
					bookmarked_at: null,
					status: null,
					updatedAt: new Date(),
				})
				.execute();
			return {
				form,
			};
		}

		let input: SaveToLibrarySchema = isMediaType(form.data.type)
			? makeMediaSchema(form.data.entryId, form.data.type)
			: {
					entryId: form.data.entryId as number,
					type: form.data.type,
			  };

		save_to_library({
			ctx: {
				userId: session.user.userId,
			},
			input: {
				...input,
				status: form.data.status,
			},
		});
		return { form };
	},
	tag: async ({ locals, params, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const tagForm = await superValidate(request, tagSchema, { id: 'tag' });
		console.dir(
			{ tagForm },
			{
				depth: null,
			},
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
		console.log({ existingTagIds: tagIds, tagsToAdd });
		if (!tagIds.length) {
			// then delete all existing tags on this entry
			await db
				.deleteFrom('TagOnEntry')
				.where('entryId', '=', +params.id)
				.execute();
			return message(tagForm, 'Tags updated');
		}
		// if (tagsToAdd.length) {
		//     await db.insertInto("Tag")
		//         .values(tagsToAdd.map(tag => ({
		//             name: tag.name,
		//             userId: session.user.userId,
		//         })))
		//         .execute();

		//     // get ids of new tags
		//     const newTags = await db.selectFrom("Tag")
		//         .select(["id"])
		//         .where("userId", "=", session.user.userId)
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
					userId: session.user.userId,
				})),
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
		//             userId: session.user.userId,
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
		//     userId: session.user.userId,
		// }) as const)
		// // await db.insertInto("Tag")
		// //     .values(tags)
	},
	updateBookmark: async (e) => {
		const { locals, params, request } = e;
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const form = await superValidate<typeof updateBookmarkSchema, Message>(
			request,
			updateBookmarkSchema,
			{ id: 'update' },
		);
		console.log({ form });
		if (!form.valid) {
			return fail(400, { update: form });
		}
		const { status } = form.data;
		await db
			.updateTable('Bookmark')
			.where('entryId', '=', +params.id)
			.where('userId', '=', session.user.userId)
			.set({
				status,
			})
			.execute();
		return message(form, {
			status: 'success',
			text: status ? `Status updated to ${status}` : undefined,
		});
	},
	update_relation: validate_form(relationSchema, async ({ data }) => {
		await update_relation(data);
	}),
};

const relation_schema = z.object({
	relatedEntryId: z.coerce.number().int(),
	type: z
		.enum(['Related', 'SavedFrom', 'Grouped'])
		.default('Related')
		.optional(),
});
