import { db } from '@margins/db';
import type { DB } from '@margins/db/kysely/types';
import type { InferResult, SelectExpression } from 'kysely';

type EntryExpression = SelectExpression<DB, 'Entry'>;

export const select = [
	'Entry.id',
	'Entry.html',
	'Entry.author',
	'Entry.uri',
	'Entry.title',
	'Entry.image',
	'Entry.summary',
] satisfies EntryExpression[];

function _$selectType() {
	return db.selectFrom('Entry').select(select);
}

export type Item = InferResult<ReturnType<typeof _$selectType>>[number];
