import { db, json } from '@margins/db';
import type { DB } from '@margins/db/kysely/types';
import {
	sql,
	type ExpressionBuilder,
	type ReferenceExpression,
	type Expression,
	type SqlBool,
	type SelectQueryBuilder,
} from 'kysely';
import type {
	PullRequestV1,
	PullResponseOKV1,
	PatchOperation,
} from 'replicache';
import { groupBy, mapValues, pipe, toPairs } from 'remeda';

const TABLES = ['Bookmark', 'Annotation'] satisfies (keyof DB)[];
// type TableName = typeof TABLES[number];
// const TABLE_KEY = {} satisfies {
//     [key in TableName]?: string[];
// }

export async function POST({ locals, request }) {
	console.log('pull server');

	// const authorizationHeader = request.headers.get('Authorization');
	// const sessionId = auth.readBearerToken(authorizationHeader ?? '');

	// if (!sessionId) {
	// 	return Response.json({ error: 'Unauthorized' }, { status: 401 });
	// }
	if (!locals.user) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const user = locals.user;

	const req = (await request.json()) as PullRequestV1;

	const actor = 'user';

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

		const results: [string, { id: string; key: string, version: string; }[]][] =
			[];

		// if "user" (which in this case yes it is)
		if (actor === 'user') {
			console.log('syncing user');

			// TODO: workspaceid etc

			// TODO: loop through everything, for now we'll get all entries for user

			const tableFilters = {
				Bookmark: ({ eb }) => eb('Bookmark.deleted', 'is', null),
			} satisfies {
				[key in (typeof TABLES)[number]]?: (args: {
					eb: ExpressionBuilder<DB, key>;
					ref: ReferenceExpression<DB, key>;
				}) => Expression<SqlBool>;
			};
			let now = Date.now();
			let combined:
				| SelectQueryBuilder<DB, (typeof TABLES)[number], any>
				| undefined = undefined;
			for (const name of TABLES) {
				let query = tx
					.selectFrom(name)
					.select(({ fn, ref, val }) => [
						sql<string>`${name}`.as('name'),
						// TODO: entry could be string or number, whoops
						ref('id').as('id'),
						ref('updatedAt').as('updatedAt'),
						fn<string>('concat_ws', [val('/'), val(name), 'id']).as('key'),
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
		}

		for (const [name, entries] of results) {
			const arr = [];
			for (const entry of entries) {
				const version = new Date(entry.version).getTime();
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
		for (const [name, items] of Object.entries(toPut)) {
			const ids = items.map((item) => item.id);

			const keys = Object.fromEntries(items.map((item) => [item.id, item.key]));

			if (!ids.length) continue;
			const table = TABLES.find((t) => t === name);
			if (!table) continue;

			let query = await tx.selectFrom(table).selectAll().where('id', 'in', ids);

			if (actor === 'user') {
				// TODO: and userId in table...
				query = query.where('userId', '=', user.id);
			}
			const rows = await query.execute();

			for (const row of rows) {
				const key = keys[row.id];
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

		const clients = await tx
			.selectFrom('replicache_client')
			.select(['id', 'lastMutationId', 'clientVersion'])
			.where('clientGroupId', '=', req.clientGroupID)
			.where('clientVersion', '>', cvr.clientVersion)
			.execute();

		const lastMutationIDChanges = Object.fromEntries(
			clients.map((c) => [c.id, c.lastMutationId] as const),
		);

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

			return {
				cookie: nextCvr.version,
				lastMutationIDChanges,
				patch,
			} satisfies PullResponseOKV1;
		}

		return {
			cookie: req.cookie,
			lastMutationIDChanges,
			patch: [],
		} satisfies PullResponseOKV1;
	});

	return Response.json(resp);
}
