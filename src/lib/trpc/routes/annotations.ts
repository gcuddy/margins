import { AnnotationType, Prisma } from "@prisma/client";
import type { JSONContent } from "@tiptap/core";
import { z } from "zod";

import {
    contextualAnnotationArgs
} from "$lib/prisma/selects/annotations";
import { saveAnnotationSchema } from "$lib/prisma/zod-inputs";

import { protectedProcedure, router } from "../t";

const idSchema = z.object({
    id: z.string() // <- cuid or nanoid
});

export const annotationWithBodySchema = idSchema.extend({ body: z.string().min(1) });

// TODO: clean up create, save, note, etc... into create, update, delete, etc.
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
        const [annotations, richAnnotations] = await ctx.prisma.$transaction([ctx.prisma.annotation.findMany({
            where: {
                // REVIEW: while this works, it seems probably not efficient? maybe okay if annotations are short
                OR: [
                    {
                        body: {
                            contains: input,
                        },
                        // Unfortunately, this seems able to only search the first level of the JSON, and only hit exact matches,
                        // contentData: {
                        //     path: "$.content[*].content[*].text",
                        //     array_contains: input
                        // }
                    }
                ],
                userId,
            },
            ...contextualAnnotationArgs,
        }),
        ctx.prisma.annotation.findMany({
            where: {
                contentData: {
                    not: {
                        equals: null
                    }
                },
                userId
            },
            ...contextualAnnotationArgs,
        })
        ]);
        // now filter richannotations
        console.time("filtering rich annotations")
        const matchingRichAnnotations: typeof richAnnotations = [];
        richAnnotations.forEach((a) => {
            const contentData = a.contentData as JSONContent;
            // walk through all "text" nodes and search for input
            let found = false
            function recurse(node: JSONContent) {
                // if (found) return true;
                if (node.type === "text") {
                    console.log(node.text, input)
                    if (node.text?.toLowerCase().includes(input.toLowerCase())) {
                        console.log("found", node.text)
                        found = true;
                        matchingRichAnnotations.push(a);
                        return true;
                    }
                }
                if (node.content && !found) {
                    node.content.forEach(recurse)
                }
            }
            recurse(contentData);
        })
        console.timeEnd("filtering rich annotations")
        console.log({ matchingRichAnnotations })
        return [...matchingRichAnnotations, ...annotations];
    }),
    // TODO: consolidate save and update
    save: protectedProcedure.input(saveAnnotationSchema.extend({
        entryId: z.number().or(z.number().array())
    }).partial()).mutation(async ({ ctx, input }) => {
        const { id } = input;
        const { tags, entryId, ...rest } = input;
        // TODO: write this as upsert
        const tagsToCreate = tags?.filter(t => !t.id) || [];
        console.log({ tags, tagsToCreate })
        if (tagsToCreate.length) {
            await ctx.prisma.tag.createMany({
                data: tagsToCreate.map(t => ({
                    name: t.name,
                    userId: ctx.userId
                })),
                skipDuplicates: true
            });
        }
        const upsertArgs = (entryId?: number): Prisma.AnnotationUpsertArgs => ({
            where: {
                id: id ?? "",
            },
            create: {
                type: "annotation",
                ...rest,
                entryId,
                userId: ctx.userId,
                tags: tags ? {
                    connect: tags.map(t => ({
                        name_userId: {
                            name: t.name,
                            userId: ctx.userId
                        }
                    }))
                } : undefined
            },
            update: {
                ...rest,
                entryId,
                tags: tags ? {
                    set: tags.map(t => ({
                        name_userId: {
                            name: t.name,
                            userId: ctx.userId
                        }
                    }))
                } : undefined
            }
        })
        if (Array.isArray(entryId)) {
            const annotations = await ctx.prisma.$transaction(entryId.map(e => ctx.prisma.annotation.upsert(upsertArgs(e))))
            return annotations;
        } else {
            return await ctx.prisma.annotation.upsert(upsertArgs(entryId))
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
    delete: protectedProcedure.input(z.string().or(z.array(z.string()))).mutation(async ({ ctx, input }) => {
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
                id: z.string(),
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
    create: protectedProcedure.input(saveAnnotationSchema.partial()).mutation(async ({ ctx, input }) => {
        const { userId } = ctx;
        const { entryId, collectionId, tags, ...rest } = input;
        return await ctx.prisma.annotation.create({
            data: {
                ...rest,
                entry: entryId ? {
                    connect: {
                        id: input.entryId,
                    }
                } : undefined,
                type: input.type || AnnotationType.annotation,
                creator: {
                    connect: {
                        id: userId
                    }
                },
                collections: collectionId ? {
                    create: {
                        collectionId,
                    }
                } : undefined,
                tags: tags ? {
                    connectOrCreate: tags.map(t => ({
                        where: {
                            name_userId: {
                                name: t.name,
                                userId
                            }
                        },
                        create: {
                            name: t.name,
                            userId
                        }
                    })),
                } : undefined
            },
        });
    }),
    detail: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
        const { id } = input;
        const annotation = await ctx.prisma.annotation.findUnique({
            where: {
                id,
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
                entry: {
                    select: {
                        title: true
                    }
                },
                collections: {
                    select: {
                        collection: true
                    }
                }
            },
        });
        if (!annotation) return null;
        return { ...annotation, contentData: annotation.contentData as JSONContent | null };
    })
});
