import pin from '$lib/server/actions/pin';
import type { Actions } from './$types';

import { db } from '$lib/db';
import { bulkEntriesSchema } from '$lib/schemas';
import type { FilterLibrarySchema } from '$lib/schemas/library';
import { loginRedirect } from '$lib/utils/redirects';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const { locals, params } = event;
	const session = await locals.auth.validate();
	if (!session) throw loginRedirect(event);
	const view = await db
		.selectFrom('SmartList as v')
		.leftJoin('Favorite as pin', 'pin.smartListId', 'v.id')
		.where('v.userId', '=', session.user.userId)
		.where('v.id', '=', +params.id)
		.select([
			'v.id',
			'v.name',
			'v.conditions',
			'pin.id as pin_id',
			'v.filterData',
			'v.entryFilterType',
		])
		.$narrowType<{
			filterData: FilterLibrarySchema | undefined;
		}>()
		.executeTakeFirstOrThrow();

	return {
		view,
		bulkForm: superValidate(bulkEntriesSchema),
		session,
	};
};
export const actions: Actions = {
	pin: (e) => pin(e, { smartListId: +e.params.id }),
};
