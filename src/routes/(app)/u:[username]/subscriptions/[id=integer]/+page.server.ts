import { error, redirect } from "@sveltejs/kit";

import { db } from "$lib/db";
import { createCaller } from "$lib/trpc/router";

import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	const { params } = event;
	try {
		const caller = await createCaller(event);
		const { entries } = await caller.entries.byFeed({
			id: +params.id,
		});
		// const entries = [];
		const { subscriptions } = await event.parent();
		const subscription = subscriptions.find((s) => s.feedId === +params.id);
		return {
			entries,
			subscription,
		};
	} catch (e) {
		throw redirect(300, "/login");
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete: async ({ params, locals }) => {
		console.log(`Deleting subscription`);
		// Importantly, this deletes a user's SUBSCRIPTION to the FEED.
		// the FEED ID is the one in the params, so it's perhaps a bit confusing.
		const { user } = await locals.validateUser();
		if (!user || user.username !== params.username) {
			return error(401, "Unauthorized");
		}
		// todo: call /api/subscriptions/:id DELETE... or....
		try {
			await db.subscription.delete({
				where: {
					userId_feedId: {
						feedId: Number(params.id),
						userId: user.userId,
					},
				},
				// TODO: unique subscription user id and feed id
			});
			return {
				success: true,
			};
		} catch (e) {
			console.error(e);
			throw error(400, "Error deleting");
		}
	},
    edit: async (e) => {
        // TODO!
    }
};
