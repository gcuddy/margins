import { db } from '$lib/db';
import { CRON_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';
import { sleep } from '$lib/utils';
import { sql } from 'kysely';

// This cleans up orphaned userentries

export async function GET({ request }) {
	if (!dev) {
		// then validate the request
		const authHeader = request.headers.get('authorization');

		if (authHeader !== `Bearer ${CRON_SECRET}`) {
			error(401, 'Unauthorized');
		}
	}

	let batchSize = 100;

	let iteration = 0;
	let numDeletedRows = 0;
	while (true) {
		const result =
			await sql`DELETE ue FROM UserEntry ue JOIN (select u.id from UserEntry u left join Entry e on u.entryId = e.id where e.id is null limit ${batchSize}) uu on ue.id = uu.id;`.execute(
				db,
			);

		iteration++;
		numDeletedRows += Number(result.numAffectedRows);
		// loop guard
		if (iteration > 100) {
			break;
		}
		if (Number(result.numAffectedRows) < batchSize) {
			break;
		}
		await sleep(1000);
	}

	return json({
		success: true,
		numDeletedRows,
	});
}
