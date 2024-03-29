import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { feedSearchFormSchema } from '$components/subscriptions/subscription-entry.schema';
import { subscriptionCreate } from '$lib/db/queries/subscriptions';
import { findFeed } from '$lib/feeds/parser';
import type { Config } from '@sveltejs/adapter-vercel';
import { redirect } from 'sveltekit-flash-message/server';
import { createMessage } from '$lib/types/forms';
import { db } from '$lib/db';
import { loginRedirect } from '$lib/utils/redirects';

// export const config: Config = {
// 	runtime: 'nodejs18.x',
// };

export async function load(event) {
	const session = await event.locals.auth.validate();

	if (!session) {
		throw loginRedirect(event);
	}
}

export const actions = {
	add: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const formData = await event.request.formData();

		// check for subscriptionId + 'delete' - if so, then delete it
		const subscriptionId = formData.has('subscriptionId')
			? Number(formData.get('subscriptionId'))
			: undefined;

		if (subscriptionId && formData.has('delete')) {
			await db
				.deleteFrom('Subscription')
				.where('id', '=', subscriptionId)
				.where('userId', '=', session.user.userId)
				.execute();
			throw redirect(
				'/subscriptions',
				{
					status: 'success',
					text: 'Unsubscribed successfully',
				},
				event,
			);
		}

		const dataArray: Array<{
			title: string;
			url: string;
			podcastIndexId?: number;
		}> = [];

		formData.forEach((value, key) => {
			const match = key.match(/(\d+)-(title|url|podcastIndexId)/);
			if (match && match[1]) {
				const index = Number.parseInt(match[1], 10);
				const type = match[2];

				if (!dataArray[index]) {
					dataArray[index] = { title: '', url: '', podcastIndexId: undefined };
				}

				//@ts-expect-error - this is fine
				dataArray[index][type] = value.toString();
				// if (type === 'title') {
				// } else if (type === 'url') {
				// 	dataArray[index].url = value.toString();
				// }
			}
		});

		console.log('[subscriptions > add] dataArray', dataArray);

		const { ids } = await subscriptionCreate({
			ctx: {
				userId: session.user.userId,
			},
			input: dataArray,
		});

		if (ids[0]) {
			throw redirect(
				`/subscription/${ids[0]}`,
				createMessage({
					status: 'success',
					text: 'Subscription added successfully',
				}),
				event,
			);
		}

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
		console.log('[subscriptions > search] form.data.url', form.data.url);
		const feeds = await findFeed(form.data.url);

		console.log('[subscriptions > search] feeds', feeds);

		return {
			feeds,
			form,
		};
	},
};
