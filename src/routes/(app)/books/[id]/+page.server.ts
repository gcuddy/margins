import { createCaller } from "$lib/trpc/router";
import { saveInputSchema } from "$lib/trpc/routes/books";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
	save: async (e) => {
		const parsed = saveInputSchema.safeParse(Object.fromEntries(await e.request.formData()));
		if (!parsed.success) {
			return fail(400, {
				data: parsed.error.message,
			});
		}
		const caller = await createCaller(e);
		return await caller.books.save(parsed.data);
	},
};
