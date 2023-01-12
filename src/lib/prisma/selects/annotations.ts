import { Prisma } from "@prisma/client";

export const baseAnnotationSelect = Prisma.validator<Prisma.AnnotationSelect>()({
	id: true,
	createdAt: true,
	editedAt: true,
	tags: true,
	deleted: true,
	type: true,
	private: true,
	parentId: true,
	body: true,
	creator: {
		select: {
			username: true,
		},
	},
	color: true,
});

export const annotationSelect = Prisma.validator<Prisma.AnnotationSelect>()({
	id: true,
	createdAt: true,
	editedAt: true,
	tags: true,
	type: true,
	private: true,
	parentId: true,
	deleted: true,
	body: true,
	creator: {
		select: {
			username: true,
		},
	},
	color: true,
	// TODO: how to get this to work recursively?
});
