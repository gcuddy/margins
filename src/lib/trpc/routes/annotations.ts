import { AnnotationType } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../t";

export const annotationRouter = router({
	search: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		// REVIEW: how to handle Json and full text search?
		// or: should Body just be a string?
		// [path]?
		const { userId } = ctx;
		const annotations = ctx.prisma.annotation.findMany({
			where: {
				// REVIEW: while this works, it seems probably not efficient? maybe okay if annotations are short
				body: {
					string_contains: input,
				},
				userId,
			},
		});
		return annotations;
	}),
	// save: protectedProcedure
	//     .input(z.object({
	//         // TODo
	//     }))
	// ,
	note: protectedProcedure
		.input(
			z.object({
				entryId: z.number(),
				body: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { entryId, body } = input;
			const { userId } = ctx;
			const annotation = await ctx.prisma.annotation.create({
				data: {
					entryId,
					type: "note",
					userId,
					body,
				},
			});
			return annotation;
		}),
	delete: protectedProcedure.input(z.number().or(z.array(z.number()))).mutation(async ({ ctx, input }) => {
		// since self relations exist, we have to use raw sql lol
		// SOFT DELETE
		if (Array.isArray(input)) {
			// const deleted = await ctx.prisma.annotation.deleteMany({
			// 	where: {
			// 		id: {
			// 			in: input,
			// 		},
			// 	},
			// });
			const deleted = await ctx.prisma.annotation.updateMany({
				where: {
					id: {
						in: input,
					},
				},
				data: {
					deleted: new Date(),
				},
			});
			return deleted;
		} else {
			const deleted = await ctx.prisma.annotation.update({
				where: {
					id: input,
				},
				data: {
					deleted: new Date(),
				},
			});
			// const deleted = await ctx.prisma.annotation.delete({
			// 	where: {
			// 		id: input,
			// 	},
			// });
			return deleted;
		}
	}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				data: z
					.object({
						private: z.boolean(),
						body: z.string(),
					})
					.partial(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, data } = input;
			return ctx.prisma.annotation.update({
				where: {
					id,
				},
				data,
			});
		}),
	reply: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				body: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx;
			const { id, body } = input;
			const annotation = await ctx.prisma.annotation.create({
				data: {
					type: AnnotationType.reply,
					body,
					parentId: id,
					userId,
				},
			});
			return annotation;
		}),
	// TODO: shold allow for limit, etc
	loadReplies: protectedProcedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		// needs to match same as entries.load["annotations"]
		.query(async ({ ctx, input }) => {
			const { id } = input;
			const replies = await ctx.prisma.annotation.findMany({
				where: {
					parentId: id,
				},
				include: {
					creator: {
						select: {
							username: true,
						},
					},
					color: true,
					_count: {
						select: {
							children: true,
						},
					},
				},
			});
			return replies.map((reply) => {
				if (reply.deleted) {
					return {
						...reply,
						body: "",
					};
				} else {
					return reply;
				}
			});
		}),
});
