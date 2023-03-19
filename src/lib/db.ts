import { PrismaClient } from '@prisma/client';

import { annotationsMiddleware } from './prisma/middleware';

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var db: PrismaClient | undefined;
}

const globalForPrisma = global as unknown as { db: PrismaClient };

export const db =
	globalForPrisma.db ||
	new PrismaClient({
		log: [
			'info',
			'warn',
			'error',
		],
	});

db.$use(async (params, next) => {
	const before = Date.now();

	const result = await next(params);

	const after = Date.now();

	console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

	return result;
});

annotationsMiddleware(db);

if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;
