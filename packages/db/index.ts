import { Kysely, sql, type RawBuilder, type Expression } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import type { Config as PlanetScaleConfig } from '@planetscale/database';

import type { DB as $KyselyDB } from './kysely/types.js';

export const createDb = (config: PlanetScaleConfig) => {
	const db = new Kysely<KyselyDB>({
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
	return db;
};

export type DB = ReturnType<typeof createDb>;
export type KyselyDB = $KyselyDB;

export function json<T>(obj: T): RawBuilder<T> {
	return sql`${JSON.stringify(obj)}`;
}

export function values<T>(expr: Expression<T>) {
	return sql<T>`VALUES(${expr})`;
}
