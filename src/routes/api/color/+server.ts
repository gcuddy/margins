import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'nodejs18.x',
};

import { error, json } from '@sveltejs/kit';
import { colord } from 'colord';

import { redis } from '$lib/redis';

import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({
	params,
	request,
	setHeaders,
	url,
}) => {
	// TODO: rate limit

	const uri = url.searchParams.get('uri') as string;

	if (!uri) {
		error(400, 'Missing uri');
	}

	const key = `color:${uri}`;

	const cached = await redis.get(key);

	if (cached) {
		// eslint-disable-next-line no-console
		console.log(`[color] Cache hit!`);

		// const ttl = await redis.ttl(key);
		// setHeaders({
		// 	'Cache-Control': `public, max-age=${ttl}`,
		// });
		return json(cached);
	}



	const color = {
		hex: '#000000',
	};

	let adjusted = color.hex;

	adjusted = color.isDark
		? colord(color.hex).lighten(0.1).toHex()
		: colord(color.hex).darken(0.1).toHex();

	color.hex = adjusted;

	const ONE_WEEK = 60 * 60 * 24 * 7;

	setHeaders({
		'Cache-Control': `public, max-age=${ONE_WEEK}`,
	});
	redis.set(key, color, { ex: ONE_WEEK });

	return json(color);
};
