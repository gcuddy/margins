import { type RequestHandler, error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';
import { addSubscription, findFeed } from '$lib/feeds/parser';
import { subscriptionApiSelect } from '$lib/feeds/types';
// https://github.com/feedbin/feedbin-api/blob/master/content/subscriptions.md
export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const since = url.searchParams.get('since');
	const date = since ? new Date(since) : undefined;
	// todo: params: mode (extended), sort
	const subscriptions = await db.subscription.findMany({
		select: subscriptionApiSelect,
		where: {
			// createdAt
			createdAt: {
				gt: date,
			},
		},
		orderBy: {
			title: 'asc',
		},
	});
	return json(subscriptions);
};

const postSubscriptionSchema = z.object({
	feedUrl: z.string(),
});

export const POST: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	try {
		const data = await request.json();
		const parsed = postSubscriptionSchema.safeParse(data);
		if (!parsed.success) {
			throw error(400, {
				message: 'Missing or malformed parameter: feedUrl',
			});
		}
		const { feedUrl } = parsed.data;
		// Now find feed URL
		// if there's only one, subscribe. if none, return 404. if multiple, return 300 multiplice choice with the choices.
		// perhaps first check to make sure it doesn't already exist? if it does, then we can just return that. but not sure if that adds unnecessary call
		const existingSubscription = await db.subscription.findFirst({
			where: {
				feed: {
					feedUrl: feedUrl,
				},
				userId: session.userId,
			},
			select: subscriptionApiSelect,
		});
		if (existingSubscription) {
			return new Response(JSON.stringify(existingSubscription), {
				status: 302,
				headers: {
					Location: `/api/subscriptions/${existingSubscription.id}.json`,
				},
			});
		}
		const { feeds } = await findFeed(feedUrl);
		if (feeds.length === 1) {
			// subscribe()
			try {
				const subscription = await addSubscription({
					feedUrl: feeds[0].url,
					title: feeds[0].title,
					userId: session.userId,
				});
				if (!subscription) {
					throw Error('Could not parse feed');
				}
				return json(subscription, {
					status: 201,
					headers: {
						// TODO: base_url
						Location: `/api/subscriptions/${subscription.id}.json`,
					},
				});
			} catch (e) {
				console.error(e);
				throw error(500);
			}
		} else if (feeds.length > 1) {
			return new Response(JSON.stringify(feeds), {
				status: 300,
			});
		} else {
			throw error(404, 'No feeds found');
		}
	} catch (e) {
		throw error(400, {
			message: 'Need parameter feedUrl',
		});
	}
};
