import { redirect } from "@sveltejs/kit";
import { writable } from "svelte/store";

import { createCachedValue } from "$lib/cache";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, depends, data, parent }) => {
	// TODO: should I not put this here??
	try {
		const res = await fetch(`/api/v1/tags.json`);
		// todo: error handling
		const tags = await res.json();
		console.log({ tags });
		return {
			// currentList: writable<ICurrentList>({
			// 	slug: "/",
			// 	ids: [],
			// }),
			selectedItems: writable([]),
			tags,
			filterMap: createCachedValue("filterMap", () => writable(new Map())),
			...(await parent()),
		};
	} catch (e) {
		console.error(e);
		throw redirect(300, "/login");
	}
};
