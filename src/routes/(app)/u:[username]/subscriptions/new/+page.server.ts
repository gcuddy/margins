import { error, fail } from "@sveltejs/kit";
import { z } from "zod";

import { addSubscription, findFeed } from "$lib/feeds/parser";
import { getJsonFromRequest, notEmpty } from "$lib/utils";

import type { Actions } from "./$types";

const feedsToAdd = z.object({
	feeds: z.array(z.object({ url: z.string().url(), title: z.string() })),
});
export const actions: Actions = {
	search: async ({ request, fetch }) => {
		const data = await request.formData();
		const url = data.get("url") as string;
		console.log({ url });
		const feedData = await findFeed(url);
		return feedData;
	},
	add: async ({ request, locals, fetch }) => {
		try {
			const session = await locals.validate();
			if (!session) {
				return error(401, "Not authorized");
			}
			const data = await getJsonFromRequest(request);
			data.feeds = (data.feeds as { url?: string }[]).filter((a) => a.url);
			const parsed = feedsToAdd.parse(data);
			// now connect to db, find/create those feeds, update their entries, and add a subscription for the user
			const addedFeeds = await Promise.all(
				parsed.feeds.map(async ({ url, title }) =>
					addSubscription({ feedUrl: url, title, userId: session.userId })
				)
			);
			notEmpty(addedFeeds);
			return { added: addedFeeds.filter(notEmpty), success: true };
		} catch (e) {
			console.error(e);
			return fail(400, {
				message: "error parsing data",
			});
		}
	},
};
