import { createCaller, type RouterInputs } from "$lib/trpc/router";
import { fail } from "@sveltejs/kit";
import { match, P } from "ts-pattern";
import type { Actions, Action } from "./$types";

type TRPCAnnotations = RouterInputs["annotations"];

type TRPCActions = Partial<Record<keyof TRPCAnnotations, Action>>;

// TODO: type return value to be same as return value of trpc

export const actions: TRPCActions = {
	reply: async (e) => {
		const data = await e.request.formData();
		const id = data.get("id");
		const body = data.get("body");
		return await match([id, body])
			.with([P.string, P.string], async ([id, body]) => {
				if (!body) {
					// TODO: to make this more elegant should put in the pattern matching
					return fail(400, {
						body: false,
					});
				}
				const { annotations } = await createCaller(e);
				return annotations.reply({
					id: +id,
					body,
				});
			})
			.otherwise(([id, body]) =>
				fail(400, {
					id: !!id,
					body: !!body,
				})
			);
	},
	// loadReplies: async (e) => {
	//     const data = await e.request.formData();
	//     const id  = data.get("id");
	//     if (id && typeof id === "string") {
	//         const
	//     }
	// },
};
