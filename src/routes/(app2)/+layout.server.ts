import { feedSearchFormSchema } from '$components/subscriptions/subscription-entry.schema';
import { superValidate } from 'sveltekit-superforms/server';
import type { LayoutServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async (event) => {
	const feedSearchForm = superValidate(zod(feedSearchFormSchema));

	return {
		feedSearchForm,
		user_data: event.locals.user,
		userId: event.locals.user?.id,
		session: event.locals.session,
	};
}) satisfies LayoutServerLoad;
