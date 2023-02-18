import { createCaller } from "$lib/trpc/router";
import { fail } from "@sveltejs/kit";
import { z } from "zod";
import type { Actions } from "./$types";

const podcastSchema = z.object({
	podcastIndexId: z.coerce.number(),
	title: z.string(),
	unsubscribe: z.coerce.boolean().optional(),
	subscriptionId: z.coerce.number().optional(),
});

export const actions: Actions = {
	subscribe: async (event) => {
		const formData = await event.request.formData();
		const parsed = podcastSchema.safeParse(Object.fromEntries(formData));
		console.log({ parsed });
		if (!parsed.success) {
			return fail(400);
		}
		const caller = await createCaller(event);
		const subscription = await caller.podcasts.subscribe(parsed.data);
		return subscription;
	},
	toggleFinished: async (event) => {
		const caller = await createCaller(event);
		const data = await event.request.formData();
		const episodeId = Number(data.get("episodeId"));
		const finished = data.get("finished") === "true";
		const obj = Object.fromEntries(data);
		console.log({ obj })
		return caller.podcasts.updateEpisodeInteraction(obj as any)
	},
};
