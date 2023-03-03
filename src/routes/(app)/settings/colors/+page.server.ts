import { fail } from "@sveltejs/kit";

import { saveColorDescriptionSchema } from "$lib/prisma/zod-inputs";
import { createCaller } from "$lib/trpc/router";

import type { Actions } from "./$types";

export const actions: Actions = {
	default: async (e) => {
		const data = Object.fromEntries(await e.request.formData());
		const parsed = saveColorDescriptionSchema
			.safeParse(data);
		if (!parsed.success) {
			return fail(400);
		}
		const caller = await createCaller(e);
		const desc = await caller.user.saveColorDescription(parsed.data);
		return desc;
	},
};
