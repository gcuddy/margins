import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'nodejs18.x',
};

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
	// TODO: rate limit

	return new Response();
};
