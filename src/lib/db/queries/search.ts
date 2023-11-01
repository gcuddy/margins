import { qSchema } from '$lib/schemas/inputs';
import type { GetCtx } from '../types';
import { db } from '$lib/db';
import { sql } from 'kysely';
import { query } from '$lib/db/types';
import { searchNotes } from './note';
import commandScore from 'command-score';

export async function searchEntryTitles({
	ctx,
	input,
}: GetCtx<typeof qSchema>) {
	const match_q = `${input.q}*`;
	const like_q = `%${input.q}%`;
	return await db
		.selectFrom('Entry as e')
		.innerJoin('Bookmark as b', (join) =>
			join.onRef('e.id', '=', 'b.entryId').on('b.userId', '=', ctx.userId),
		)
		.where(
			sql`MATCH(e.title,e.author) AGAINST (${match_q} IN BOOLEAN MODE) and (e.title like ${like_q} or e.author like ${like_q})`,
		)
		.select([
			'e.id',
			'e.title',
			'e.type',
			'e.image',
			'e.published',
			'e.author',
			'e.googleBooksId',
			'e.tmdbId',
			'e.podcastIndexId',
			'e.spotifyId',
			'e.uri',
			'e.wordCount',
		])
		.limit(25)
		// .orderBy("createdAt", "desc")
		.execute();
}

export const searchTitlesQuery = query({
	fn: searchEntryTitles,
	schema: qSchema,
});

export const searchAll = query({
	fn: async ({ ctx, input }) => {
		// should think about constructing something that weighs titles more
		const [entries, notes] = await Promise.all([
			searchEntryTitles({ ctx, input }),
			searchNotes(input.q, ctx.userId),
		]);
		// TODO: scoring...

		// score and sort by title match

		const results: Array<
			| {
					type: 'entry';
					id: number;
					data: (typeof entries)[number];
					score: number;
			  }
			| {
					type: 'note';
					id: string;
					data: (typeof notes)[number];
					score: number;
			  }
		> = [];

		// TODO: score by other matches and weigh less (author * .5,e tc.)

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			if (!entry) continue;
			const score = entry.title ? commandScore(input.q, entry.title) : 0;
			results.push({
				type: 'entry',
				id: entry.id,
				data: entry,
				score,
			});
		}

		for (let i = 0; i < notes.length; i++) {
			const note = notes[i];
			if (!note) continue;
			const score = note.title ? commandScore(input.q, note.title) : 0;
			results.push({
				type: 'note',
				id: note.id,
				data: note,
				score,
			});
		}

		results.sort((a, b) => b.score - a.score);

		return results;
	},
	schema: qSchema,
});
