// This NEEDS to be authenticated

import { error, json } from "@sveltejs/kit";

import { refresh } from "$lib/jobs/refresher";

import type { RequestHandler } from "./$types";

import { CRON_KEY } from "$env/static/private";

export const GET: RequestHandler = async ({ request }) => {
	const apiKey = request.headers.get("authorization");
	if (CRON_KEY !== apiKey) {
		throw error(401, {
			message: "Not authenticated",
		});
	}
	// TODO: authenticate request
	// request.headers.get("Authorization")

	console.time(`[refreshFeeds]`);

	// TODO: cache last refreshed and make sure it isn't overworking

	// can this happen in background? If I return a response without awaiting does it still work on Vercel?

	// TODO: for each X feeds, create job/queue with qstash
	const count = await refresh({});
	// 10s
	console.timeEnd(`[refreshFeeds]`);
	if (count) {
		return json({
			success: true,
			posted: new Date(),
			count,
		});
	} else {
		throw error(500, {
			message: "Error refreshing. Check logs.",
		});
	}
};
