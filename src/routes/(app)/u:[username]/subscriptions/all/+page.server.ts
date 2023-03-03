import { createContext } from "$lib/trpc/context";
import { appRouter } from "$lib/trpc/router";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const cursor = event.url.searchParams.get("cursor") || "";
	event.cookies.set("rss", "true", {
		path: "/",
	});
	// const caller = await appRouter.createCaller(await createContext(event));
	// const { entries, nextCursor } = await caller.entries.listForUserSubscriptions({
	// 	cursor: +cursor || undefined,
	// });
	return {
		// entries,
		// nextCursor,
		title: "All items",
	};
};
