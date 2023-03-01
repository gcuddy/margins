import { createCaller } from "$lib/trpc/router";

import type { Actions } from "./$types";

export const actions: Actions = {
    	favorite: async (e) => {
		const data = await e.request.formData();
		const caller = await createCaller(e);
		return await caller.favorites.create({
			smartListId: Number(e.params.id),
			sortOrder: Number(data.get("sortOrder") || -99999),
		});
	}
}
