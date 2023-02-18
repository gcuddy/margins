import { createContext } from "$lib/trpc/context";
import { appRouter } from "$lib/trpc/router";
import { getJsonFromRequest } from "$lib/utils";
import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
	save: async (event) => {
		const json = await getJsonFromRequest(event.request);
		const caller = await appRouter.createCaller(await createContext(event));
		// const filter = await caller.filters.save(json);
	},
};
