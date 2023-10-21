/* eslint-disable no-console */
import { Kysely, sql, type RawBuilder, Expression } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

import { DATABASE_PASSWORD, DATABASE_USERNAME } from '$env/static/private';

import { dev } from '$app/environment';
import type { DB } from './prisma/kysely/types';

export const config = {
	host: 'aws.connect.psdb.cloud',
	password: DATABASE_PASSWORD,
	username: DATABASE_USERNAME,
};

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var db: Kysely<DB> | undefined;
}

const globalForKyseley = global as unknown as { db: Kysely<DB> };

export const db =
	globalForKyseley.db ||
	new Kysely<DB>({
		dialect: new PlanetScaleDialect({
			...config,
			useSharedConnection: true,
		}),
		log: (event) => {
			if (!dev) {
				return;
			}
			if (event.level === 'query') {
				console.log(event.query.sql);
				console.log(event.query.parameters);
			}
		},
	});

export function json<T>(obj: T): RawBuilder<T> {
	return sql`${JSON.stringify(obj)}`;
}

export function values<T>(expr: Expression<T>) {
	return sql<T>`VALUES(${expr})`;
}

// export const db =
// 	globalForPrisma.db ||
// 	new PrismaClient({
// 		log: [
// 			'info',
// 			'warn',
// 			'error',
// 		],
// 	});

// db.$use(async (params, next) => {
// 	const before = Date.now();

// 	const result = await next(params);

// 	const after = Date.now();

// 	console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

// 	return result;
// });

// annotationsMiddleware(db);

if (process.env.NODE_ENV !== 'production') {
	globalForKyseley.db = db;
}
