import { Prisma, PrismaClient } from '@prisma/client';
import { createPrismaRedisCache } from 'prisma-redis-middleware';
import slugify from 'slugify';

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
	if (String(params.model) === 'Article' && ['create', 'update'].includes(String(params.action))) {
		console.log('params', params);
		if (params.args.data?.title) {
			console.log('slugifying title');
			let slug = slugify(params.args.data.title, {
				lower: true,
				strict: true,
			});
			while (slug.length > 70) {
				// remove last word (unless it's the only word)
				const lastSpace = slug.lastIndexOf('-');
				if (lastSpace === -1) {
					break;
				}
				slug = slug.slice(0, lastSpace);
			}
			params.args.data.slug = slug;
		}
	}
	const result = await next(params);
	const after = Date.now();
	console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
	return result;
});

// db.$use(async (params, next) => {
// 	if (String(params.model) === 'Article' && ['create', 'update'].includes(String(params.action))) {
// 		// slugify title
// 		console.log('slugify title');
// 		params.args.data.slug = slugify(params.args.data.title);
// 		console.log({ params });
// 		return next(params);
// 	}
// });

// db.$use(cacheMiddleware);

if (process.env.NODE_ENV !== 'production') global.db = db;
