import { createCaller } from "$lib/trpc/router";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
	delete: async (e) =>
		(await createCaller(e)).bookmarks.delete(+e.params.id).then(() => {
			throw redirect(307, e.request.headers.get("referer") ?? "/");
		}),
};
