// This runs once a day, and keeps the last *200* items for each feed, unless the entry has been saved in a user's library.
// Feedbin keeps 400, but for now we'll just do 200.
// Via:
// Feedbin stores 400 of the most recent articles per feed. Feeds with more that 400 articles are truncated daily to keep them from growing unbounded.
// Unread items are also capped at around 400 per feed. However, there are no limits on the age of the unread items.
import { db } from '$lib/db';
import { CRON_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';
import { sql } from 'kysely';

export async function GET({ request }) {
	if (!dev) {
		// then validate the request
		const authHeader = request.headers.get('authorization');

		if (authHeader !== `Bearer ${CRON_SECRET}`) {
			error(401, 'Unauthorized');
		}
	}

	const result = await sql`DELETE e
    FROM Entry e
    JOIN Feed f ON f.id = e.feedId
    JOIN (
        SELECT id, feedId,
               ROW_NUMBER() OVER (PARTITION BY feedId ORDER BY id DESC) AS row_num
        FROM Entry
    ) ranked_entries ON e.id = ranked_entries.id
    WHERE row_num > 200
      AND NOT EXISTS (
        SELECT 1
        FROM Bookmark b
        WHERE b.entryId = e.id
    )`.execute(db);

	// TODO: clean up userentry for those entries that were deleted (see purge/user-entry)

	console.log({ result });

	return json({
		success: true,
		deleted: result.numAffectedRows,
	});
}
