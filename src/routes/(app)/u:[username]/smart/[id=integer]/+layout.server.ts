
import { db } from "$lib/db";

import type {PageServerLoad } from "./$types";

export const load: PageServerLoad = async (e) => {
	const { url, params } = e;
	console.time("smartlist");
	const list = await db.smartList.findFirstOrThrow({
		where: {
			id: Number(params.id),
		},
		// include: {
		// 	favorite: true,
		// },
	});

	console.timeEnd("smartlist");
	// console.log({ articles, list });
	return {
		// articles,
		list,
	};
};

// export const actions: Actions = {
// 	update: async ({ locals, request, params }) => {
// 		const session = await locals.validate();
// 		if (!session) throw error(401);
// 		const id = +params.id;

// 		try {
// 			const data = await request.formData();
// 			const name = data.get("name") as string;
// 			const description = data.get("description") as string;
// 			const icon = chosenIcon.parse(JSON.parse(data.get("icon") as string));
// 			const result = await db.smartList.update({
// 				where: {
// 					id,
// 				},
// 				data: {
// 					name,
// 					description,
// 					icon,
// 				},
// 				include: {
// 					favorites: {
// 						where: {
// 							userId: session.userId,
// 						},
// 					},
// 				},
// 			});
// 			// redirect, right?
// 			return {
// 				location: `/u:${params.username}/collection/${result.id}`,
// 			};
// 			// throw redirect(303, `/u/${params.username}/collection/${result.id}`);
// 		} catch (e) {
// 			console.error(e);
// 			return fail(400, {
// 				message: "error updating view",
// 			});
// 		}
// 	},
// 	favorite: async (e) => {
// 		const data = await e.request.formData();
// 		const caller = await createCaller(e);
// 		return await caller.favorites.create({
// 			smartListId: Number(e.params.id),
// 			sortOrder: Number(data.get("sortOrder") || -99999),
// 		});
// 	},
// };