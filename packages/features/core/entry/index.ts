import type { DB, KyselyDB } from '@margins/db';
import type { InferResult, SelectExpression } from 'kysely';
import { zod } from '../utils/zod.js';
import { ArticleSchema } from '@margins/parser';
import { useTransaction } from '../utils/transaction.js';
import { createId } from '@margins/lib';

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

// TODO: create with user content if it exists...
export const create = zod(ArticleSchema, async (input) =>
	useTransaction(async (tx) => {
		const { url, ...article } = input;
		await tx
			.insertInto('Entry')
			.ignore()
			.values({
				id: createId(),
				updatedAt: new Date(),
				uri: url,
				...article,
			})
			.execute();

		const entry = await tx
			.selectFrom('Entry')
			.select(select)
			.where('uri', '=', url)
			.executeTakeFirst();

		return entry;
	}),
);

export const fromUrl = zod(ArticleSchema.pick({ url: true }), ({ url }) =>
	useTransaction(async (tx) => {
		return await tx
			.selectFrom('Entry')
			.select(select)
			.where('uri', '=', url)
			.executeTakeFirstOrThrow();
	}),
);
