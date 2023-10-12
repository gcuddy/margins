import type { RequestHandler } from './$types';

import { QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY } from '$env/static/private';
import { PUBLIC_API_BASE } from '$env/static/public';
import { db } from '$lib/db';
import { Receiver } from '@upstash/qstash';
import { qstash } from '$lib/redis';
import type { Config } from '@sveltejs/adapter-vercel';
import { json } from '@sveltejs/kit';
import { z } from 'zod';
const receiver = new Receiver({
	currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
	nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
});

const config: Config = {
	runtime: 'nodejs18.x',
};
const feedSchema = z.object({
	feedUrl: z.string(),
	id: z.number(),
	lastParsed: z.coerce.date(),
});

const schema = z.object({
	feeds: z.array(feedSchema),
});

function getUnixTime(dateString: string | Date | number): number {
	const date = new Date(dateString);
	return date.getTime();
}

// The job of this function is to get feeds that haven't been parsed in the last hour, and fan them out to the queue

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const isValid = await receiver.verify({
		signature: request.headers.get('Upstash-Signature') ?? '',
		body,
	});
	if (!isValid) {
		console.log('Invalid request:', body);
		return new Response(null, { status: 400 });
	}

	const feeds = await db
		.selectFrom('Feed')
		.select(['feedUrl', 'id', 'lastParsed'])
		// .where("lastParsed", "<", new Date(Date.now() - 1000 * 60 * 60))
		.orderBy('lastParsed', 'asc')
		.limit(50)
		.execute();
	// batch them into groups of 25 and fan out using qstash
	const batches: (typeof feeds)[] = [];
	while (feeds.length > 0) {
		batches.push(feeds.splice(0, 25));
	}

	await Promise.all(
		batches.map(async (feeds) => {
			const res = await qstash.publishJSON({
				url: new URL('/api/cron/updateFeeds', PUBLIC_API_BASE).toString(),
				body: {
					feeds,
				},
			});
			console.log('QStash response:', res);
		}),
	);
	return json({ success: true });
};
