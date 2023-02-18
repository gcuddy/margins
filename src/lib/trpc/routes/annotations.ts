import { AnnotationType } from "@prisma/client";
import { z } from "zod";

import {
	contextualAnnotationArgs
} from "$lib/prisma/selects/annotations";
import { saveAnnotationSchema } from "$lib/prisma/zod-inputs";

import { protectedProcedure, router } from "../t";

const idSchema = z.object({
	id: z.number().min(1),
});

export const annotationWithBodySchema = idSchema.extend({ body: z.string().min(1) });

export const annotationRouter = router({
	list: protectedProcedure.query(async ({ ctx, input }) => {
		const { userId, prisma } = ctx;
		const annotations = await prisma.annotation.findMany({
			where: {
				userId,
				deleted: null,
				type: AnnotationType.annotation,
			},
			...contextualAnnotationArgs,
		});
		return annotations;
	}),
	search: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		// REVIEW: how to handle Json and full text search?
		// or: should Body just be a string?
		// [path]?
		const { userId } = ctx;
		const annotations = await ctx.prisma.annotation.findMany({
			where: {
				// REVIEW: while this works, it seems probably not efficient? maybe okay if annotations are short
				body: {
					string_contains: input,
				},
				userId,
			},
			...contextualAnnotationArgs,
		});
		return annotations;
	}),
	// TODO: consolidate save and update
	save: protectedProcedure.input(saveAnnotationSchema.partial()).mutation(async ({ ctx, input }) => {
		const { id } = input;
		if (id) {
			return await ctx.prisma.annotation.update({
				where: {
					id,
					entryId: input.entryId,
				},
				data: {
					...input,
					// TODO: tags
				},
			});
		} else {
			return await ctx.prisma.annotation.create({
				data: {
					...input,
					userId: ctx.userId,
					type: "annotation",
				},
			});
		}
	}),
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
		// SOFT DELETE
		if (Array.isArray(input)) {
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
			const annotationCount = await ctx.prisma.annotation.count({
				where: {
					children: {
						some: {},
					},
					id: input,
				},
			});
			if (annotationCount > 0) {
				const deleted = await ctx.prisma.annotation.update({
					where: {
						id: input,
					},
					data: {
						deleted: new Date(),
					},
				});
				return deleted;
			} else {
				const deleted = await ctx.prisma.annotation.delete({
					where: {
						id: input,
					},
				});
			}
		}
	}),
	reply: protectedProcedure
		// REVIEW: should this take in an entryId?
		.input(annotationWithBodySchema)
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
