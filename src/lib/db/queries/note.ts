import { sql } from 'kysely';
import { db } from '$lib/db';
import { withEntry } from '../selects';
import type { JSONContent } from '@tiptap/core';
import type { TargetSchema } from '$lib/annotation';

export function generateSearchNotePhrase(term: string, alias = 'Annotation') {
	// TODO: this is a naive and slow implementation, but it works for now
	return sql`LOWER(JSON_UNQUOTE(JSON_EXTRACT(${sql.raw(
		alias,
	)}.contentData, '$**.text'))) LIKE '%${sql.raw(term)}%'`;
}

export async function searchNotes(q: string, userId: string) {
	return await db
		.selectFrom('Annotation as a')
		.where(sql`MATCH(a.title,a.body,a.exact) AGAINST (${q})`)
		.select([
			'a.id',
			'a.contentData',
			'a.start',
			'a.body',
			'a.target',
			'a.entryId',
			'a.title',
			'a.createdAt',
			'a.exact',
			'a.type',
			'a.parentId',
		])
		.select((eb) => [withEntry(eb)])
		.where('a.userId', '=', userId)
		.where('a.parentId', 'is', null)
		.where('a.deleted', 'is', null)
		.$narrowType<{
			contentData: JSONContent | null;
			target: TargetSchema | null;
		}>()
		.limit(50)
		.orderBy('a.createdAt', 'desc')
		.execute();
}
