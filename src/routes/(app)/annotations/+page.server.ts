import { createCaller, type RouterInputs } from "$lib/trpc/router";
import { annotationWithBodySchema } from "$lib/trpc/routes/annotations";
import { fail } from "@sveltejs/kit";
import { match, P } from "ts-pattern";
import { z } from "zod";
import type { Actions, Action } from "./$types";

type TRPCAnnotations = RouterInputs["annotations"];

type TRPCActions = Partial<Record<keyof TRPCAnnotations, Action>>;

// TODO: type return value to be same as return value of trpc

const updateSchema = z.object({
	id: z.number(),
	body: z.string().optional(),
	private: z.boolean().optional(),
});

export const actions: TRPCActions = {
	reply: async (e) => {
		const data = Object.fromEntries(await e.request.formData());
		const replyData = annotationWithBodySchema.safeParse(data);
		if (replyData.success) {
			const { annotations } = await createCaller(e);
			return annotations.reply(replyData.data);
		} else {
			return fail(400, { errors: replyData.error.errors });
		}
	},
	update: async (e) => {
		const data = Object.fromEntries(await e.request.formData());
		const updateData = updateSchema.safeParse(data);
		if (updateData.success) {
			const caller = await createCaller(e);
			await caller.annotations.save(updateData.data);
		}
	},
};
