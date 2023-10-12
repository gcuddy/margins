import type { RequestHandler } from './$types';

// import { Receiver } from '$lib/qstash/receiver';
import { Receiver } from '@upstash/qstash';
import {
	QSTASH_CURRENT_SIGNING_KEY,
	QSTASH_NEXT_SIGNING_KEY,
} from '$env/static/private';
import { z } from 'zod';
import { getFeedText } from '$lib/rss/utils';
// import Parser from 'rss-parser';
import type { Config } from '@sveltejs/adapter-vercel';
import { db } from '$lib/db';
import { sql } from 'kysely';
import { adaptEntryFromItem } from '$lib/rss/entries';
const receiver = new Receiver({
	currentSigningKey: 'sig_58ZWbtZMJcK2KiGzSKvPMpAc6bMU',
	nextSigningKey: 'sig_7Jxkuj6iFhsqpwwvELrbvR26vZhv',
});

const config: Config = {
	runtime: 'nodejs18.x',
};
const feedSchema = z.object({
	feedUrl: z.string().nullish(),
	id: z.number(),
	lastParsed: z.coerce.date().nullish(),
});

const schema = z.object({
	feeds: z.array(feedSchema),
});

function getUnixTime(dateString: string | Date | number): number {
	const date = new Date(dateString);
	return date.getTime();
}

const updateLastParsed = async (feedId: number) => {
	await db
		.updateTable('Feed')
		.set({ lastParsed: new Date() })
		.where('id', '=', feedId)
		.execute();
};

async function processFeed({
	feedUrl,
	id: feedId,
	lastParsed,
}: z.infer<typeof feedSchema>) {
	try {
		if (!feedUrl) return;
		const text = await getFeedText(feedUrl);
		// now parse feed text
		const feed = await {};
		// console.log(feed)

		// get items after lastParsed
		const last_parsed = lastParsed ? getUnixTime(lastParsed) : 0;
		const newItems = feed.items
			.filter((item) => {
				return true;
				const pub_date =
					item.isoDate ?? item.pubDate ?? item.published ?? item.updated;
				if (!pub_date) {
					// if no pub date just return true and we'll filter later
					item.check_if_exists = true;
					return true;
				}
				const pub_date_unix = getUnixTime(pub_date);
				return pub_date_unix > last_parsed;
			})
			.slice(0, 10);
		// If there are no new items, return early
		if (newItems.length === 0) {
			console.log(`No new items for ${feedUrl}.`);
			// Update the feed's last parsed date
			await updateLastParsed(feedId);
			return;
		}
		console.log(`Processing ${newItems.length} new items for ${feedUrl}...`);
		// const itemsToAdd = await Promise.all(newItems.map(async item => {
		//     // Use the GUID or URL as the unique identifier for each item
		//     const uniqueId = item.guid || item.link;
		//     let exists = !!uniqueId;
		//     // check if item exists
		//     if (exists) {
		//         // const existsQuery = await conn.execute(`SELECT 1 FROM Entry e where e.feedId = ? and (e.guid = ? or e.uri = ?)`, [feedId, item.guid, item.uri]);
		//         // existsQuery.rows.length > 0 ? exists = true : exists = false;
		//         const existsQuery = await sql`select exists(${db.selectFrom('Entry').selectAll()
		//             .where('Entry.feedId', '=', feedId)
		//             .where(({ or, cmpr }) => or([
		//                 cmpr('Entry.guid', '=', item.guid ?? ''),
		//                 cmpr('Entry.uri', '=', item.link ?? '')
		//             ]))
		//             })`.execute(db);
		//         existsQuery.rows.length > 0 ? exists = true : exists = false;
		//     }
		//     if (!exists) {
		//         console.log("inserting", item.link)
		//         // await conn.execute(`INSERT INTO Entry (feedId, title, uri, guid, published, author, html) VALUES (?, ?, ?, ?)`, [feedId, item.title ?? null, item.link ?? null, item.guid ?? null, item.pubDate ? new Date(item.pubDate) : null, item.author ?? null, item.content ?? null]);
		//         return item;
		//     }
		//     // console.log({ exists })
		// }));
		// console.log(`Actually adding ${itemsToAdd.length} new items for ${feedUrl}...`)
		// const new_items = itemsToAdd.filter(Boolean);
		// console.log(`*Actually* adding ${newItems.length} new items for ${feedUrl}...`)
		await updateLastParsed(feedId);
		// if (new_items.length === 0) {
		//     console.log(`No new items for ${feedUrl}.`)
		//     return;
		// }

		// TODO: think about getting from podcastindex instead of rss feed for nice data

		// TODO: Podcast etc
		// console.log(`Inserting ${newItems.length} new items for ${feedUrl}...`);
		const entries = await Promise.all(
			newItems.map((item) => adaptEntryFromItem(item, feedId)),
		);
		await db
			.insertInto('Entry')
			.values(entries)
			.onDuplicateKeyUpdate({
				feedId,
			})
			.execute();
	} catch (e) {
		console.error(e);
		// TODO
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	// const isValid = await receiver.verify({
	//     signature: request.headers.get('Upstash-Signature') ?? '',
	//     body
	// });
	// if (!isValid) {
	//     console.log('Invalid request:', body);
	//     return new Response(null, { status: 400 });
	// }

	const parsed = schema.safeParse(JSON.parse(body));
	if (!parsed.success) {
		console.log('Invalid request:', body);
		return new Response(null, { status: 400 });
	}
	const { feeds } = parsed.data;
	console.log(`Processing ${feeds.length} feeds...`);
	await Promise.all(feeds.map(processFeed));
	// now do something with the feeds

	return new Response();
};
