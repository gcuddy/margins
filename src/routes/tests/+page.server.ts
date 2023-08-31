import type { DocumentType } from '@prisma/client';
import { type Actions, fail, redirect } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { db, json } from '$lib/db';
import { getFirstBookmarkSort } from '$lib/db/selects';
import { allowedThemes } from '$lib/features/settings/themes';
import { normalizeUrl } from '$lib/feeds/utils';
import { nanoid } from '$lib/nanoid';
import type parse from '$lib/parse';
import { add_url_schema, validateAuthedForm } from '$lib/schemas';

const themes = allowedThemes;

type AddUrlReturnedData = {
	googleBooksId?: string | null;
	id: number;
	podcastIndexId?: number | null;
	spotifyId?: string | null;
	tmdbId?: number | null;
	type: DocumentType;
} & {
	new: boolean;
};

export const actions: Actions = {
	addUrl: validateAuthedForm(add_url_schema, async ({ form, fetch, session }) => {
		const { url, status, via_entryid, via_url } = form.data;
		// check if url is isbn
		const is_isbn = /^(\d{10}|\d{13})$/.test(url);

		const uri = is_isbn ? `isbn:${url}` : normalizeUrl(url);
		let entryId: number;
		// try selecting the entry first

        let entryToReturn: AddUrlReturnedData | undefined = undefined;

		const existing_entry = await db
			.selectFrom('Entry as e')
			.select(['e.type', 'e.id', 'e.spotifyId', 'e.googleBooksId', 'e.tmdbId', 'e.podcastIndexId'])
			.where('uri', '=', uri)
			.executeTakeFirst();
		if (existing_entry) {
			console.log({ existing_entry });
			entryId = Number(existing_entry.id);

            entryToReturn = {
                ...existing_entry,
                new: false
            };
		} else {
			const res = await fetch(`/api/parse/${encodeURIComponent(uri)}`);
			if (!res.ok) {
				return fail(500, {
					message: res.statusText
				});
			}
			const { url: _url, ...rest } = await (res.json() as ReturnType<typeof parse>);
			const entry = await db
				.insertInto('Entry')
				.values({
					updatedAt: new Date(),
					// ...data,
					...rest,
					original: rest.original ? json(rest.original) : null,
					podcastIndexId: rest.podcastIndexId ? Number(rest.podcastIndexId) : null,
					uri
				})
				.ignore()
				.executeTakeFirst();
			console.log({ entry });
			entryId = Number(entry.insertId);
            entryToReturn = {
                googleBooksId: rest.googleBooksId,
                id: entryId,
                new: true,
                podcastIndexId: rest.podcastIndexId ? Number(rest.podcastIndexId) : null,
                spotifyId: null,
                tmdbId: rest.tmdbId,
                type: rest.type!
            };
		}
		if (!entryId) {
			return fail(500, {
				message: 'Could not create or retrieve entry'
			});
		}
		const promises = [];
		console.log({ via_entryid });
		if (via_entryid) {
			// create relation
			const add_relation = async () => {
				const relation = await db
					.insertInto('Relation')
					.values({
						entryId,
						id: nanoid(),
						relatedEntryId: via_entryid,
						type: 'SavedFrom',
						updatedAt: new Date(),
						userId: session.user.userId
					})
					.ignore()
					.execute();
				console.log({ relation });
			};
			promises.push(add_relation());
		}

		// create bookmark
		const add_bookmark = async () => {
			const sort_order = await getFirstBookmarkSort(session.user.userId);
			await db
				.insertInto('Bookmark')
				.values({
					entryId,
					sort_order,
					status,
					updatedAt: new Date(),
					userId: session.user.userId
				})
				.ignore()
				.execute();
		};
		promises.push(add_bookmark());

		await Promise.all(promises);

        return entryToReturn;

		// throw redirect(303, '/tests/library/backlog');
	}),
	// This action is called when the user clicks the theme button
setTheme: async ({ url, cookies, request }) => {
		const theme = url.searchParams.get('theme') ?? String((await request.formData()).get('theme'));
		const redirectTo = url.searchParams.get('redirectTo');

		console.log({ redirectTo, theme });

		if (!theme || !themes.includes(theme)) {
			return fail(400);
		}

		console.log('theme');

		if (theme) {
			cookies.set('theme', theme, {
				maxAge: 60 * 60 * 24 * 365,
				path: '/',
				secure: dev ? false : true
			});
		}
		if (redirectTo) {
			throw redirect(303, redirectTo ?? '/');
		}
	}
};
