import { db } from '$lib/db';
import { CRON_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';
import { sql } from 'kysely';
import { sleep } from '$lib/utils';
import { generateInviteCode } from '$lib/nanoid';

export async function GET(event) {
	if (!dev) {
		// then validate the request
		const authHeader = event.request.headers.get('authorization');

		if (authHeader !== `Bearer ${CRON_SECRET}`) {
			error(401, 'Unauthorized');
		}
	}

	// select 100 users who have less than 3 codes (can customize if they should filter for unused or not)
	// then generate 3 codes for each of them
	// then insert them into the database

	const batchSize = 100;
	let iteration = 0;

	while (true) {
		if (iteration > 100) {
			break;
		}
		const users = await db
			.selectFrom('auth_user as u')
			.leftJoin('InvitationCode as ic', 'ic.ownerId', 'u.id')
			.groupBy('u.id')
			.having((eb) => eb.fn.count('ic.code'), '<', 3)
			.select(['u.id'])
			.limit(100)
			.execute();

		if (users.length === 0) {
			break;
		}

		iteration++;

		// now generate codes for each of them
		await db
			.insertInto('InvitationCode')
			.values(
				users.map((u) => ({
					ownerId: u.id,
					code: generateInviteCode(),
				})),
			)
			// ignore in extremely rare cases where the code already exists
			.ignore()
			.execute();

		if (users.length < batchSize) {
			break;
		}

		await sleep(1000);
	}

	// now loop

	return json({
		success: true,
	});

	// db.insertInto('InvitationCode')
	// 	.columns(['ownerId', 'code'])
	// 	.expression((eb) =>
	// 		eb.selectFrom('auth_user as u').innerJoin(
	// 			(eb) =>
	// 				eb
	// 					.selectFrom('InvitationCode as ic')
	// 					.select(['ic.ownerId'])
	// 					.select((eb) => eb.fn.count('ic.code').as('count'))
	// 					.where('ic.used', '=', 0)
	// 					.groupBy('ic.ownerId')
	// 					.having(sql`count < 3`)
	// 					.as('i'),
	// 			(join) => join.onRef('u.id', '=', 'i.ownerId'),
	// 		).select()
	// 	);
}
