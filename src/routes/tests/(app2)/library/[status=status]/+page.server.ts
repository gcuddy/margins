/* eslint-disable no-console */
import type { Status } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import {
	defaultViewPreferences,
	type ViewPreferences,
} from '$components/view-preferences/view-preferences.schema';
import { db, json } from '$lib/db';
import { viewPreferencesCreate } from '$lib/db/queries/view-preferences';
import { nanoid } from '$lib/nanoid';
import { bulkEntriesSchema, urlSchema } from '$lib/schemas';
import type { LibraryResponse } from '$lib/server/queries';
import { statusLookup, type Type, types } from '$lib/types';
import { handleLoginRedirect } from '$lib/utils/redirects';

import { fetchList } from '../fetch.server';
import type { PageServerLoad } from './$types';

async function getOrCreateViewPreferences(
	userId: string,
	status: Status | 'All',
): Promise<{
	id: string;
	preferences: ViewPreferences;
}> {
	console.time('viewPreferences');

	const viewPreferences = await db
		.selectFrom('ViewPreferences')
		.where('userId', '=', userId)
		.where('viewType', '=', status)
		.select(['preferences', 'id'])
		.$narrowType<{ preferences: ViewPreferences }>()
		.executeTakeFirst();
	if (viewPreferences) {
		console.timeEnd('viewPreferences');
		return viewPreferences;
	}
	// if it doesn't exist, create one
	const id = nanoid();
	const preferences = defaultViewPreferences;
	await db
		.insertInto('ViewPreferences')
		.values({
			id,
			preferences: json(preferences),
			userId,
			viewType: status,
		})
		.execute();
	console.timeEnd('viewPreferences');
	return {
		id,
		preferences,
	};
}

export const load = (async (event) => {
	const { fetch, locals, url } = event;
	// const session = await locals.auth.validate();
	// if (!session) {
	//     throw redirect(302, handleLoginRedirect(event));
	// }
	const status =
		event.params.status.toLowerCase() === 'all'
			? null
			: statusLookup[
					event.params.status.toLowerCase() as keyof typeof statusLookup
			  ];
	// if (!status) {
	//     // this shouldn't be the case given our param checker, bt just in case
	//     throw redirect(302, "/tests/library/now");
	// }
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, handleLoginRedirect(event));
		throw error(401, 'Unauthorized');
	}

	event.depends('entries');
	// const userId = session.user.userId;

	const type = types.includes(url.searchParams.get('type') ?? '')
		? (url.searchParams.get('type') as Type)
		: undefined;

	return {
		Status: status,
		bulkForm: superValidate(bulkEntriesSchema),
		// userId: session.user.userId,
		// entries,
		// next,
		session,

		status: status
			? (status.toLocaleLowerCase() as keyof typeof statusLookup)
			: null,

		type,

		urlForm: superValidate(urlSchema),
		// get view preferences
		// TODO: review if we should put this into get_library query
		viewPreferences: getOrCreateViewPreferences(
			session.user.userId,
			status ?? 'All',
		),
	};
}) satisfies PageServerLoad;
