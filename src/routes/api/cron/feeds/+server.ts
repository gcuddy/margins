// TODO: this probably needs to be optimized in the future - right now we're running on the edge, maybe serverless is better (longer 5 minute duration, etc)
// but for now it works

import { dev } from '$app/environment';
import { CRON_SECRET } from '$env/static/private';
import { db } from '$lib/db';
import {
	getFeedInsertable,
	getPodcastFeedInsertable,
} from '$lib/db/queries/subscriptions';
import type { Entry } from '$lib/prisma/kysely/types';
import { error, json } from '@sveltejs/kit';
import { Insertable, sql } from 'kysely';

export async function GET({ request }) {
	if (!dev) {
		// then validate the request
		const authHeader = request.headers.get('authorization');

		if (authHeader !== `Bearer ${CRON_SECRET}`) {
			throw error(401, 'Unauthorized');
		}
	}
	// TODO: put a limit on this?
	console.time('[cron] feeds');
	console.time('get feeds');
	const feeds = await db
		.selectFrom('Feed as f')
		.distinct()
		// only get feeds that have subscriptions
		.innerJoin('Subscription as s', 's.feedId', 'f.id')
		// Only get feeds that haven't been parsed in the last hour - change this to whatever cron job frequency we have
		.where('f.lastParsed', '<', sql`NOW() - INTERVAL 1 HOUR`)
		.select(['f.id', 'f.lastParsed', 'f.podcastIndexId', 'f.feedUrl'])
		.limit(100)
		.execute();
	console.timeEnd('get feeds');
	console.time('feed loop');
	console.log('feeds', feeds.length);

	const feedInsertables: Array<Insertable<Entry>> = [];
	const podcastFeedInsertables: Array<Insertable<Entry>> = [];

	for (const feed of feeds) {
		if (feed.podcastIndexId) {
			try {
				const items = await getPodcastFeedInsertable(feed);
				if (items.length) {
					podcastFeedInsertables.push(...items);
				}
			} catch (e) {
				console.log('error updating podcast feed', feed, e);
			}
		} else if (feed.feedUrl) {
			try {
				const items = await getFeedInsertable(feed);
				if (items.length) {
					feedInsertables.push(...items);
				}
			} catch (e) {
				console.log('error updating feed', feed, e);
			}
		}
	}
	console.timeEnd('feed loop');

	console.time('inserting feeds');
	await db.transaction().execute(async (trx) => {
		// TODO: onduplicatkeyupdate?
		if (feedInsertables.length) {
			await trx.insertInto('Entry').values(feedInsertables).ignore().execute();
		}
		if (podcastFeedInsertables.length) {
			await trx
				.insertInto('Entry')
				.values(podcastFeedInsertables)
				.ignore()
				.execute();
		}

		// update feeds
		return await trx
			.updateTable('Feed')
			.set({ lastParsed: sql`NOW()` })
			.where(
				'id',
				'in',
				feeds.map((f) => f.id),
			)
			.execute();
	});
	console.timeEnd('inserting feeds');

	console.timeEnd('[cron] feeds');

	return json({ success: true, updatedFeedCount: feeds.length });
	// now update feeds
}
