import type { PrismaClient } from '@prisma/client';
import {Kysely} from 'kysely'
import {PlanetScaleDialect} from 'kysely-planetscale'
import type { DB } from "./prisma/kysely/types"
import { DATABASE_PASSWORD, DATABASE_USERNAME } from "$env/static/private"

export const config = {
    host: 'aws.connect.psdb.cloud',
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD
}
import { annotationsMiddleware } from './prisma/middleware';
import { dev } from '$app/environment';

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var db: PrismaClient | undefined;
}

const globalForPrisma = global as unknown as { db: PrismaClient };

export const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect(config),
  log: (event) => {
    if (!dev) return
    if (event.level === "query") {
        console.log(event.query.sql)
        console.log(event.query.parameters)
    }
  }
});
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

// if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;
