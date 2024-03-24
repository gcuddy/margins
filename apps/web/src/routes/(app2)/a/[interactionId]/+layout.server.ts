import { db } from '$lib/db';
import { entrySelect } from '$lib/db/selects';
import { loginRedirect } from '$lib/utils/redirects';
import { error, redirect } from '@sveltejs/kit';
import { jsonObjectFrom } from 'kysely/helpers/mysql';

export async function load(event) {
	// todo: use query client for this i guess
	console.time('interaction');
	const interaction = await db
		.selectFrom('EntryInteraction as i')
		.where('i.id', '=', +event.params.interactionId)
		.select((eb) =>
			jsonObjectFrom(
				eb
					.selectFrom('Entry as e')
					.select(entrySelect)
					.select((eb) =>
						jsonObjectFrom(
							eb
								.selectFrom('Bookmark as b')
								.select(['b.id'])
								.whereRef('b.entryId', '=', 'e.id'),
						).as('bookmark'),
					)
					.whereRef('e.id', '=', 'i.entryId'),
			).as('entry'),
		)
		.innerJoin('auth_user as u', 'u.id', 'i.userId')
		.select([
			'i.id',
			'i.note',
			'i.rating',
			'i.finished',
			'i.revisit',
			'i.private',
			'u.username',
			'u.id as user_id',
		])
		.executeTakeFirstOrThrow();

	if (interaction.private) {
		const session = event.locals.session;
		if (!session || session.user.userId !== interaction.user_id) {
			// throw forbidden error
			throw loginRedirect(event);
		}
	}

	console.timeEnd('interaction');
	return {
		interaction,
	};
}
