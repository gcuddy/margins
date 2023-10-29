import { subscriptionUpdate } from '$lib/db/queries/subscriptions';
import { bulkEntriesSchema } from '$lib/schemas';
import { subscriptionUpdateInput } from '$lib/schemas/inputs/subscriptions.schema';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
	const session = await locals.auth.validate();
	if (!session) throw redirect(303, '/login');
	return {
		bulkForm: superValidate(bulkEntriesSchema),
		session,
	};
}

export const actions = {
	default: async (event) => {
		const session = await event.locals.auth.validate();

		const form = await superValidate(event, subscriptionUpdateInput);
		if (!session) return fail(401, { form });

		if (!form.valid) {
			return fail(400, { form });
		}

		console.dir(form, { depth: null });
		await subscriptionUpdate({
			ctx: session.user,
			input: form.data,
		});
	},
};
