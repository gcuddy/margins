import { createCaller } from "$lib/trpc/router";
import type { Actions } from "./$types";

export const actions: Actions = {
	save: async (e) => {
		const caller = await createCaller(e);
		await caller.podcasts.saveEpisode({
			episodeId: +e.params.episodeId,
		});
	},
};
