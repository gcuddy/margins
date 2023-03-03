import { json } from '@sveltejs/kit';

import { getExtendedEntry } from '$lib/entry.server';

import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { session, user } = await locals.validateUser();
	console.log({ params });
	const { id } = params;
	// TODO: error handling, finding annotation vs rss, etc
	// TODO: process u:username authorized entry/anontations etc -
	// we ask - is this entry public for this user?
	const entry = await getExtendedEntry({
		entryId: Number(id),
	});
	console.log({ entry });
	return json(entry);
};
