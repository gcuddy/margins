import { Prisma } from "@prisma/client";

import type { Selector } from "$lib/annotation";

export const baseAnnotationSelect = Prisma.validator<Prisma.AnnotationSelect>()({
    id: true,
    createdAt: true,
    editedAt: true,
    tags: true,
    deleted: true,
    type: true,
    private: true,
    contentData: true,
    parentId: true,
    body: true,
    creator: {
        select: {
            username: true,
        },
    },
    color: true,
});

export const baseAnnotationArgs = Prisma.validator<Prisma.AnnotationArgs>()({
    select: baseAnnotationSelect,
});


export const annotationSelect = Prisma.validator<Prisma.AnnotationSelect>()({
    id: true,
    createdAt: true,
    editedAt: true,
    tags: true,
    type: true,
    private: true,
    deleted: true,
    body: true,
    creator: {
        select: {
            username: true,
        },
    },
    color: true,
    // _count: {
    // 	select: {
    // 		children: true,
    // 	},
    // },
    // children: true,
    // TODO: how to get this to work recursively?
});

export const contextualAnnotationSelect = Prisma.validator<Prisma.AnnotationSelect>()({
    ...annotationSelect,
});

export const annotationArgs = Prisma.validator<Prisma.AnnotationArgs>()({
    include: {
        creator: {
            select: {
                username: true,
            },
        },
        children: {
            select: {
                ...annotationSelect,
                _count: {
                    select: {
                        children: true,
                    },
                },
            },
        },
        tags: true,
        _count: {
            select: {
                children: true,
            },
        },
    },
});

export const contextualAnnotationArgs = Prisma.validator<Prisma.AnnotationArgs>()({
    include: {
        ...annotationArgs.include,
        parent: {
            select: {
                ...annotationSelect,
                parent: true,
            },
        },
        entry: {
            select: {
                title: true,
                id: true,
                type: true
            },
        },
    },
});

export type ContextualAnnotation = Prisma.AnnotationGetPayload<typeof contextualAnnotationArgs> & {
    target: Selector | null;
};

export type BaseAnnotation = Prisma.AnnotationGetPayload<typeof baseAnnotationArgs>;
