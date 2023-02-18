import { fail } from "@sveltejs/kit";
import { match } from "ts-pattern";
import { z } from "zod";

import { type RouterInputs,createCaller } from "$lib/trpc/router";

import type { Action, Actions } from "./$types";

type TRPCAnnotations = RouterInputs["annotations"];

type TRPCActions = Partial<Record<keyof TRPCAnnotations, Action>>;

// TODO: type return value to be same as return value of trpc

const updateSchema = z.object({
	body: z.string().optional(),
	private: z.boolean().optional(),
	tags: z.string().or(z.array(z.string())).transform(
		(tags) => (typeof tags === "string" ? tags.split(",") : tags)
	).optional(),
});

export const actions: Actions = {
	update: async (e) => {
		const formData = await e.request.formData();
		const data = Object.fromEntries(formData);
		const tags = formData.getAll("tags");
		const updateData = updateSchema.safeParse({...data, tags});
		return match(updateData)
			.with({ success: true }, async ({ data }) => {
				const caller = await createCaller(e);
				await caller.annotations.save({
					id: +e.params.id,
					...data,
				});
			})
			.with({ success: false }, ({ error }) => {
				return fail(400, {
					error,
				});
			})
			.exhaustive();
	},
};
