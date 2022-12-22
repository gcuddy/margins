import { PrismaClient } from '@prisma/client';
// import Redis from 'ioredis';
// const redis = new Redis(
// 	`rediss://default:${import.meta.env.UPSTASH_REDIS_REST_TOKEN}@${
// 		import.meta.env.UPSTASH_REDIS_REST_URL
// 	}:37650`
// );
// Upstash
// import { Redis } from '@upstash/redis';
// import { createPrismaRedisCache } from 'prisma-redis-middleware';
// const redis = Redis.fromEnv();
// console.log({ redis });

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
			{
				emit: 'event',
				level: 'query',
			},
			'info',
			'warn',
			'error',
		],
	});

db.$on('query', (e) => {
	console.log('Query: ' + e.query);
	console.log('Duration: ' + e.duration + 'ms');
});
db.$use(async (params, next) => {
	const before = Date.now();

	const result = await next(params);

	const after = Date.now();

	console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

	return result;
});

// const cacheMiddleware = createPrismaRedisCache({
// 	models: [
// 		{ model: 'User', excludeMethods: ['findMany'] },
// 		{ model: 'Entry', cacheTime: 180, cacheKey: 'html' },
// 	],
// 	storage: {
// 		type: 'redis',
// 		options: {
// 			client: redis,
// 			log: console,
// 		},
// 	},
// 	cacheTime: 300,
// 	excludeModels: ['Product', 'Cart'],
// 	excludeMethods: ['count', 'groupBy'],
// 	onHit: (key) => {
// 		console.log('hit', key);
// 	},
// 	onMiss: (key) => {
// 		console.log('miss', key);
// 	},
// 	onError: (key) => {
// 		console.log('error', key);
// 	},
// });

// db.$use(cacheMiddleware);

if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;
