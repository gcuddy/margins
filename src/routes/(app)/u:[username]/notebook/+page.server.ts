import { db } from "$lib/db";
import { createCaller } from "$lib/trpc/router";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	console.time("get notebook");
	const caller = await createCaller(event);
	const annotations = await caller.annotations.list();
	console.timeEnd("get notebook");
	if (annotations) {
		return {
			annotations,
		};
	} else {
		throw error(404, "Annotations not found");
	}
};
