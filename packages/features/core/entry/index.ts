import type { DB, KyselyDB } from '@margins/db';
import type { InferResult, SelectExpression } from 'kysely';

type EntryExpression = SelectExpression<KyselyDB, 'Entry'>;

export const select = [
	'Entry.id',
	'Entry.html',
	'Entry.author',
	'Entry.uri',
	'Entry.title',
	'Entry.image',
	'Entry.summary',
] satisfies EntryExpression[];

// NOTE: this just exists to infer the type. Do not call this function.
function _$selectType() {
	let db: DB;
	const res = db!.selectFrom('Entry').select(select);
	return res;
}

export type Item = InferResult<ReturnType<typeof _$selectType>>[number];
