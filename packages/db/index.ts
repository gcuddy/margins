import { Kysely, sql, type RawBuilder, type Expression } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
// import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({
	path: '../../.env',
});
// export * from './zod/index.js';
// For development

import type { DB } from './kysely/types.js';

export const config = {
	host: (process.env.DATABASE_HOST as string) ?? 'aws.connect.psdb.cloud',
	password: process.env.DATABASE_PASSWORD as string,
	username: process.env.DATABASE_USERNAME as string,
};

export const db = new Kysely<DB>({
	dialect: new PlanetScaleDialect({
		...config,
		useSharedConnection: true,
	}),
	log: (event) => {
		if (process.env.NODE_ENV !== 'development') {
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
