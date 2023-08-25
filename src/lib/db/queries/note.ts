import { sql } from 'kysely';

export function generateSearchNotePhrase(term: string, alias = 'Annotation') {
    // TODO: this is a naive and slow implementation, but it works for now
	return sql`LOWER(JSON_UNQUOTE(JSON_EXTRACT(${sql.raw(alias)}.contentData, '$**.text'))) LIKE '%${sql.raw(
		term
	)}%'`;
}
