import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { feedSearchFormSchema } from '$components/subscriptions/subscription-entry.schema';
import { subscriptionCreate } from '$lib/db/queries/subscriptions';
import { findFeed } from '$lib/feeds/parser';

export const actions = {
	add: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const formData = await event.request.formData();

		const dataArray: Array<{ title: string; url: string }> = [];

		formData.forEach((value, key) => {
			const match = key.match(/(\d+)-(title|url)/);
			if (match && match[1]) {
				const index = Number.parseInt(match[1], 10);
				const type = match[2];

				if (!dataArray[index]) {
					dataArray[index] = { title: '', url: '' };
				}

				//@ts-expect-error - this is fine
				dataArray[index][type] = value.toString();
				// if (type === 'title') {
				// } else if (type === 'url') {
				// 	dataArray[index].url = value.toString();
				// }
			}
		});

		await subscriptionCreate({
			ctx: {
				userId: session.user.userId,
			},
			input: dataArray,
		});

		// return {
		// 	feeds,
		// 	form,
		// };
	},
	search: async (event) => {
		const form = await superValidate(event, feedSearchFormSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const feeds = await findFeed(form.data.url);

		return {
			feeds,
			form,
		};
	},
};
