// This NEEDS to be authenticated

import { json } from '@sveltejs/kit';

import { refresh } from '$lib/jobs/refresher';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// TODO: authenticate request
	// request.headers.get("Authorization")

	console.log(`refreshing feeds`);

	// TODO: cache last refreshed and make sure it isn't overworking

	// can this happen in background? If I return a response without awaiting does it still work on Vercel?
	refresh({});
	return json({
		success: true,
		posted: new Date(),
	});
};
