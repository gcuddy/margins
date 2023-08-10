import { error, fail } from "@sveltejs/kit";

import { db } from "$lib/db";

import type { Actions } from "./$types";
import { appRouter } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";
import { LocationSchema } from "$lib/types/schemas/Locations";
export const actions: Actions = {
	new: async (evt) => {
		const data = await evt.request.formData();
		const location = LocationSchema.safeParse(data.get("location"));
		if (!location.success) {
			return fail(400, {
				error: true,
			});
		}
		const caller = appRouter.createCaller(await createContext(evt));
		const state = await caller.user.createState({
			type: location.data,
		});
		return {
			success: true,
		};
	},
	update: async (evt) => {
		const data = await evt.request.formData();
		const id = data.get("id");
		const name = data.get("name");
		const color = data.get("color");
		console.log({ id, name, color });
		if (typeof id !== "string" || typeof name !== "string" || typeof color !== "string") {
			fail(400, {
				message: "invalid input",
			});
			return;
		}
		const caller = appRouter.createCaller(await createContext(evt));
		const state = await caller.user.updateStates({
			id: +id,
			name,
			color,
		});
		return {
			success: true,
		};
	},
	makeDefault: async ({ locals, request }) => {
		const data = await request.formData();
		const id = data.get("id") as string;
		const session = await locals.auth.validate();
		if (!session) {
			throw error(401, "Unauthorized");
		}
		try {
			await db.user.update({
				where: {
					id: session.user.userId,
				},
				data: {
					default_state_id: Number(id),
				},
			});
			return {
				success: true,
			};
		} catch (e) {
			console.error(e);
			throw error(400);
		}
	},
	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get("id") as string;
		const session = await locals.auth.validate();
		if (!session) {
			throw error(401, "Unauthorized");
		}
		try {
			await db.state.delete({
				where: {
					id: +id,
					userId: session.user.userId,
				},
			});
			return {
				success: true,
			};
		} catch (e) {
			console.error(e);
			throw error(400);
		}
	},
};
