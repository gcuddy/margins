import { PrismaClient } from '@prisma/client';

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var db: PrismaClient | undefined;
}

export const db =
	global.db ||
	new PrismaClient({
		log: ['query']
	});

db.$use(async (params, next) => {
	const before = Date.now();

	const result = await next(params);

	const after = Date.now();

	console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

	return result;
});

if (process.env.NODE_ENV !== 'production') global.db = db;
