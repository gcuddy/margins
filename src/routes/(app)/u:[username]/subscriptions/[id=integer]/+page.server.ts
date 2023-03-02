import { error } from "@sveltejs/kit";

import { db } from "$lib/db";

import type { Actions } from "./$types";

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
