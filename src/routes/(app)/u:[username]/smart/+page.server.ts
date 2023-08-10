import type { PageServerLoad, Action } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/db";
import { getJsonFromRequest } from "$lib/utils";

export const load: PageServerLoad = async (evt) => {
	const session = await evt.locals.auth.validate();
	if (!session) {
		throw redirect(302, "/");
	}
	const lists = await db.smartList.findMany({
		where: {
			userId: session.userId,
		},
	});
	return {
		lists,
	};
};
