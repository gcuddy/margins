import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
export async function load({ locals }) {
    console.time('loading cmd')
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const entries = await db
		.selectFrom('Bookmark as b')
		.innerJoin('Entry as e', 'e.id', 'b.entryId')
		.select([
			'e.title',
			'e.id',
			'e.uri',
			'e.image',
			'e.spotifyId',
			'e.tmdbId',
			'e.googleBooksId',
			'e.podcastIndexId',
			'e.type'
		])
		.select((eb) => eb.fn.coalesce('b.author', 'e.author').as('author'))
		.where('b.userId', '=', session.user.userId)
        .where("e.title", "is not", null)
        .$narrowType<{
            title: string;
        }>()
        .execute();

    console.timeEnd('loading cmd')
    return {
        entries
    }
}
