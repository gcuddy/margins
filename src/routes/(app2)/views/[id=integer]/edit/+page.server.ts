import { db } from '$lib/db';
import type { FilterLibrarySchema } from '$lib/schemas/library';
import { loginRedirect } from '$lib/utils/redirects';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const { locals, params } = event;
	const session = await locals.auth.validate();

	if (!session) throw loginRedirect(event);

	// TODO put in function (copied from parent route)
	const view = await db
		.selectFrom('SmartList as v')
		.where('v.userId', '=', session.user.userId)
		.where('v.id', '=', +params.id)
		.select([
			'v.id',
			'v.name',
			'v.conditions',
			'v.filterData',
			'v.entryFilterType',
		])
		.$narrowType<{
			filterData: FilterLibrarySchema | undefined;
		}>()
		.executeTakeFirstOrThrow();

	// redirect to search params for ease
	// TODO: consider if this is the best UX]
	// if (view.filterData) {
	// 	throw redirect(
	// 		303,
	// 		`/views/${view.id}/edit${defaultStringifySearch(view.filterData)}`,
	// 	);
	// }

	return {
		view,
	};
}) satisfies PageServerLoad;
