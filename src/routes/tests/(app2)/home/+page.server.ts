import type { PageServerLoad } from './$types';

import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals, parent }) => {
    const session = await locals.auth.validate();
    if (!session) throw redirect(303, '/tests/login')

    const recents = db.selectFrom("EntryInteraction as i")
        .innerJoin("Entry as e", "e.id", "i.entryId")
        .where("i.userId", "=", session.user.userId)
        .select([
            "e.id",
            "e.image",
            "e.published",
            "e.type",
            "e.title",
            "e.author",
            "e.uri",
            "e.tmdbId",
            "e.googleBooksId",
            "e.podcastIndexId",
            "e.spotifyId"

        ])
        .orderBy("i.createdAt", "desc")
        .limit(10)
        .execute();

    const recently_saved = db.selectFrom("Bookmark as b")
        .innerJoin("Entry as e", "e.id", "b.entryId")
        .where("b.userId", "=", session.user.userId)
        .select([
            "e.id",
            "e.image",
            "e.published",
            "e.type",
            "e.title",
            "e.author",
            "e.uri",
            "e.tmdbId",
            "e.googleBooksId",
            "e.podcastIndexId",
            "e.spotifyId"
        ])
        .orderBy("b.createdAt", "desc")
        .limit(10)
        .execute();

    const now = db.selectFrom("Bookmark as b")
        .innerJoin("Entry as e", "e.id", "b.entryId")
        .where("b.userId", "=", session.user.userId)
        .where("b.status", "=", "Now")
        .select([
            "e.id",
            "e.image",
            "e.published",
            "e.type",
            "e.title",
            "e.author",
            "e.uri",
            "e.tmdbId",
            "e.googleBooksId",
            "e.podcastIndexId",
            "e.spotifyId"
        ])
        .orderBy("b.createdAt", "desc")
        .limit(10)
        .execute();

    // const recentlyAdded

    return {
        recents,
        now,
        recently_saved
    };
}) satisfies PageServerLoad;
