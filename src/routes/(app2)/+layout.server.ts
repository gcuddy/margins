import { feedSearchFormSchema } from '$components/subscriptions/subscription-entry.schema';
import { db } from '$lib/db';
import { superValidate } from 'sveltekit-superforms/server';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	console.log('(app2) layout.server.ts load');
	const session = await event.locals.auth.validate();

	const feedSearchForm = superValidate(feedSearchFormSchema);
	// const feedAddForm = superValidate(feedAddFormSchema);

	return {
		// feedAddForm,
		feedSearchForm,
		user_data: session?.user,
	};

	// if (!session) {
	// 	return {};
	// }
	// const { user } = session;

	// const pins = db
	// 	.selectFrom('Favorite as p')
	// 	.where('p.userId', '=', user.userId)
	// 	.select((eb) => [
	// 		jsonObjectFrom(
	// 			eb
	// 				.selectFrom('SmartList as v')
	// 				.whereRef('v.id', '=', 'p.smartListId')
	// 				.select(['v.name', 'v.id'])
	// 		).as('view'),
	// 		jsonObjectFrom(
	// 			eb
	// 				.selectFrom('Collection as c')
	// 				.whereRef('c.id', '=', 'p.collectionId')
	// 				.select(['c.name', 'c.id'])
	// 		).as('collection'),
	// 		jsonObjectFrom(
	// 			eb.selectFrom('Tag as t').whereRef('t.id', '=', 'p.tagId').select(['t.name', 't.id'])
	// 		).as('tag')
	// 	])
	// 	.select('p.id')
	// 	.execute();
	// return {
	// 	user_data: {
	// 		// lazy loaded promises
	// 		tags: createCachedValue('tags', () => getTags(user.userId)),
	// 		pins,
	// 		// normal user data
	// 		...user
	// 	},
	// 	urlForm: superValidate(urlSchema)
	// };
}) satisfies LayoutServerLoad;
