import { Prisma, PrismaClient } from '@prisma/client';
import { createPrismaRedisCache } from 'prisma-redis-middleware';

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var db: PrismaClient | undefined;
}

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
	models: [{ model: 'RssFeed' }, { model: 'RssFeedItem', cacheTime: 1000 * 60 * 10 }],
	excludeModels: ['User'],
	storage: { type: 'memory', options: { invalidation: true, log: console } },
	cacheTime: 1000 * 60, // 1 minute
	onHit: (key) => {
		console.log('hit', key);
	},
	onMiss: (key) => {
		console.log('miss', key);
	},
	onError: (key) => {
		console.log('error', key);
	},
});
export const db =
	global.db ||
	new PrismaClient({
		log: ['query'],
	});

db.$use(async (params, next) => {
	const before = Date.now();

	const result = await next(params);

	const after = Date.now();

	console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

	return result;
});
// db.$use(cacheMiddleware);

if (process.env.NODE_ENV !== 'production') global.db = db;
