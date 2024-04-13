import type { DB, KyselyDB } from '@margins/db';
import { json } from '@margins/db';
import type { User } from 'lucia';
import type {
	PullRequestV1,
	PullResponseOKV1,
	PatchOperation,
} from 'replicache';
import { jsonObjectFrom } from 'kysely/helpers/mysql';
import { groupBy, mapValues, pipe, toPairs } from 'remeda';
import { Entry } from '../core/index.js';
import {
	sql,
	type ExpressionBuilder,
	type ReferenceExpression,
	type Expression,
	type SqlBool,
	type SelectQueryBuilder,
	type AliasedRawBuilder,
} from 'kysely';

const TABLES = [
	'Bookmark',
	'Annotation',
	'Favorite',
] satisfies (keyof KyselyDB)[];

type TableName = (typeof TABLES)[number];

const TABLE_KEY = {
	Favorite: (eb) =>
		eb
			.case()
			.when('Favorite.entryId', 'is not', null)
			.then(
				eb.fn<string>('concat_ws', [
					eb.val('/'),
					eb.val(''),
					eb.val('Pin'),
					eb.val('Entry'),
					eb.ref('entryId'),
				]),
			)
			.when('Favorite.annotationId', 'is not', null)
			.then(
				eb.fn<string>('concat_ws', [
					eb.val('/'),
					eb.val(''),
					eb.val('Pin'),
					eb.val('Annotation'),
					eb.ref('annotationId'),
				]),
			)
			.else(
				eb.fn<string>('concat_ws', [
					eb.val('/'),
					eb.val(''),
					eb.val('Pin'),
					eb.ref('id'),
				]),
			)
			.end(),
} satisfies {
	[key in TableName]?: (
		eb: ExpressionBuilder<KyselyDB, key>,
	) => Expression<string>;
};

export async function handlePull(
	db: DB,
	// TODO: actor? (in case of system etc)
	user: User,
	req: PullRequestV1,
): Promise<PullResponseOKV1> {
	// TODO

	await db
		.insertInto('replicache_client_group')
		.values({
			clientVersion: 0,
			cvrVersion: 0,
			id: req.clientGroupID,
			// TODO: actor
			updatedAt: new Date(),
		})
		.ignore()
		.execute();

	const resp = await db.transaction().execute(async (tx) => {
		const patch: PatchOperation[] = [];

		const group = (await tx
			.selectFrom('replicache_client_group')
			.select(['id', 'cvrVersion', 'clientVersion', 'updatedAt'])
			.forUpdate()
			.where('replicache_client_group.id', '=', req.clientGroupID)
			.executeTakeFirst())!;

		const oldCvr = await tx
			.selectFrom('replicache_cvr')
			.select(['data', 'clientVersion'])
			.where('clientGroupID', '=', req.clientGroupID)
			.where('id', '=', Number(req.cookie))
			.$narrowType<{ data: Record<string, number> }>()
			.executeTakeFirst();

		const cvr = oldCvr ?? {
			clientVersion: 0,
			data: {},
		};

		// TODO: implement partial sync

		const toPut: Record<string, { id: string; key: string }[]> = {};

		const nextCvr = {
			data: {} as Record<string, number>,
			version: Math.max(req.cookie as number, group.cvrVersion) + 1,
		};

		if (!oldCvr) {
			patch.push({
				op: 'clear',
			});

			patch.push({
				key: '/init',
				op: 'put',
				value: true,
			});
		}

		const results: [string, { id: string; key: string; version: string }[]][] =
			[];

		// if "user" (which in this case yes it is)
		console.log('syncing user');

		// TODO: workspaceid etc

		// TODO: loop through everything, for now we'll get all entries for user

		const tableFilters = {
			Bookmark: ({ eb }) => eb('Bookmark.deleted', 'is', null),
			// Entry: ({ eb }) => eb('', 'is', null),
		} satisfies {
			[key in (typeof TABLES)[number]]?: (args: {
				eb: ExpressionBuilder<KyselyDB, key>;
				ref: ReferenceExpression<KyselyDB, key>;
			}) => Expression<SqlBool>;
		};

		db.selectFrom('Entry').innerJoin('Bookmark', (join) => join);

		// const tableJoins = {
		//     Entry: () => ["Bookmark", (join) => join.onRef("Bookmark")]
		// } satisfies {
		//     [key in TableName]?: <J extends keyof KyselyDB>() => [J, (eb: JoinBuilder<KyselyDB, key>) => void];
		// }
		let now = Date.now();
		let combined:
			| SelectQueryBuilder<KyselyDB, (typeof TABLES)[number], any>
			| undefined = undefined;
		for (const name of TABLES) {
			let query = tx.selectFrom(name);

			// Hardcoding this in for now while I think of a more elegant way to do it
			// if (name === 'Entry') {

			// 	query = query.innerJoin('Bookmark', 'Entry.id', 'Bookmark.entryId');
			// }

			query = query
				.select((eb) => [
					sql<string>`${name}`.as('name'),
					// TODO: entry could be string or number, whoops
					sql.ref(`${name}.id`).as('id'),
					sql.ref(`${name}.updatedAt`).as('version'),
					name in TABLE_KEY
						? TABLE_KEY[name as keyof typeof TABLE_KEY](eb).as('key')
						: eb
								.fn<string>('concat_ws', [
									eb.val('/'),
									eb.val(''),
									eb.val(name),
									sql.ref(`${name}.id`),
								])
								.as('key'),
					// sql
					// 	.join(
					// 		sql`concat_ws(`,
					// 		sql.join([sql`'/'`, sql`''`, sql`${name}`, ref('id')], sql`, `),
					// 		sql.raw(`)`),
					// 	])
					// 	.as('key'),
				])
				.where('userId', '=', user.id);
			if (name in tableFilters) {
				query = query.where(({ eb, ref }) => {
					return tableFilters[name as keyof typeof tableFilters]!({
						eb,
						ref,
					});
				});
			}
			// if (name === "Entry") {
			//     query = query.innerJoin()
			// }
			if (!combined) {
				combined = query;
			} else {
				combined = combined.unionAll(query);
			}
		}
		console.log('separate', Date.now() - now);
		now = Date.now();
		const entries = await combined!.execute();
		results.push(
			...pipe(
				entries,
				groupBy((e: any) => e.name),
				toPairs,
			),
		);
		console.log('combined', Date.now() - now);

		console.log('results', JSON.stringify(results));

		for (const [name, entries] of results) {
			const arr = [];
			for (const entry of entries) {
				const version = new Date(entry.version).getTime();
				console.log({ entry, version }, { cvr });
				if (cvr.data[entry.key] !== version) {
					arr.push(entry);
				}
				delete cvr.data[entry.key];
				nextCvr.data[entry.key] = version;
			}
			toPut[name] = arr;
		}

		console.log(
			'toPut',
			mapValues(toPut, (v) => v.length),
		);
		console.log('toDel', cvr.data);

		// new data
		const tableSelects = {
			Bookmark: (eb) => [
				jsonObjectFrom(
					eb
						.selectFrom('Entry')
						.select(Entry.select)
						.whereRef('Bookmark.entryId', '=', 'Entry.id'),
				).as('entry'),
			],
			// TODO: should we do this here, or on the client? For instance by just getting all Entries as one query
			// By putting it in here we essentially have multiple copies of the same data... potentially recipe for bugs
			Favorite: (eb) => [
				jsonObjectFrom(
					eb
						.selectFrom('Entry')
						.select(['Entry.author', 'Entry.uri', 'Entry.title', 'Entry.type'])
						.whereRef('Favorite.entryId', '=', 'Entry.id'),
				).as('entry'),
			],
		} satisfies {
			[key in (typeof TABLES)[number]]?: (
				eb: ExpressionBuilder<KyselyDB, key>,
			) => AliasedRawBuilder<any, any>[];
		};
		for (const [name, items] of Object.entries(toPut)) {
			const ids = items.map((item) => item.id);

			const keys = Object.fromEntries(items.map((item) => [item.id, item.key]));

			if (!ids.length) continue;
			const table = TABLES.find((t) => t === name);
			if (!table) continue;

			let query = tx.selectFrom(table).where('id', 'in', ids);

			if (table in tableSelects) {
				query = query
					.select(tableSelects[table as keyof typeof tableSelects]!)
					.selectAll(table);
			} else {
				query = query.selectAll();
			}
			// .select(eb => {
			//     return
			// })

			// TODO: and userId in table...
			query = query.where('userId', '=', user.id);

			const rows = await query.execute();

			for (const row of rows) {
				const key = keys[(row as any).id];
				if (!key) continue;
				patch.push({
					key,
					op: 'put',
					value: row as any,
				});
			}
		}

		// remove deleted data
		for (const [key] of Object.entries(cvr.data)) {
			patch.push({
				key,
				op: 'del',
			});
		}

		// TODO: kysely incorrectly reports lastMutationId as a number, when it's actually a string (coerced from a Bigint)
		// This is  planetscale js thing.
		// It's a cause of bugs, and we should figure out a solution other than maybe wrapping it in Number each time
		// Number is good up to 2^53, which is 9007199254740992, so we should be good for a while

		const clients = await tx
			.selectFrom('replicache_client')
			.select(['id', 'lastMutationId', 'clientVersion'])
			.where('clientGroupId', '=', req.clientGroupID)
			.where('clientVersion', '>', cvr.clientVersion)
			.execute();

		const lastMutationIDChanges = Object.fromEntries(
			clients.map((c) => [c.id, Number(c.lastMutationId)] as const),
		);

		console.log('lastMutationIDChanges', JSON.stringify(lastMutationIDChanges));

		if (patch.length > 0 || Object.keys(lastMutationIDChanges).length > 0) {
			console.log('inserting', req.clientGroupID);
			await tx
				.updateTable('replicache_client_group')
				.set({
					cvrVersion: nextCvr.version,
				})
				.where('id', '=', req.clientGroupID)
				.execute();

			console.log({
				nextCvr,
			});

			await tx
				.insertInto('replicache_cvr')
				.values({
					clientGroupID: req.clientGroupID,
					clientVersion: group.clientVersion,
					data: json(nextCvr.data),
					id: nextCvr.version,
					updatedAt: new Date(),
				})
				.onDuplicateKeyUpdate({
					data: nextCvr.data,
				})
				.execute();

			// only keep last 10 versions. Review if we want more/less
			await tx
				.deleteFrom('replicache_cvr')
				.where('clientGroupID', '=', req.clientGroupID)
				.where('id', '<', nextCvr.version - 10)
				.execute();

			console.log('got here, returning', {
				cookie: nextCvr.version,
				lastMutationIDChanges,
				patch,
			});

			return {
				cookie: nextCvr.version,
				lastMutationIDChanges,
				patch,
			} satisfies PullResponseOKV1;
		}

		console.log('got here, returning', {
			cookie: req.cookie,
			lastMutationIDChanges,
			patch: [],
		});

		return {
			cookie: req.cookie,
			lastMutationIDChanges,
			patch: [],
		} satisfies PullResponseOKV1;
	});

	return resp;
}
