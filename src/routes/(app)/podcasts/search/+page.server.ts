import { createCaller } from "$lib/trpc/router";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
	search: async (e) => {
		const caller = await createCaller(e);
		const data = await e.request.formData();
		const q = data.get("q");
		if (typeof q !== "string") {
			return fail(400, {
				q,
				missing: true,
			});
		}
		const results = await caller.podcasts.public.search(q);
		return { results };
	},
};
