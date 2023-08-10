import type { PageServerLoad } from "./$types";
import { db } from "$lib/db";
import { redirect } from "@sveltejs/kit";
export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(300, "/");
	}
	const codes = await db.invitationCode.findMany({
		where: {
			owner: {
				id: session.user.userId,
			},
		},
	});
	return {
		codes,
	};
}) satisfies PageServerLoad;
