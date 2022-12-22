import { type Annotation, Prisma } from '@prisma/client';
import { z } from 'zod';

const inlineAnnotationInclude = Prisma.validator<Prisma.AnnotationInclude>()({
	// TODO...
});

export const createTemporaryAnnotation = ({
	entryId,
	type,
	userId,
	body,
	private: _private,
	readLater,
}: {
	entryId: Annotation['entryId'];
	type: Annotation['type'];
	userId: string;
} & Partial<Annotation>): Annotation => {
	return {
		body: body ? body : null,
		entryId,
		type,
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
		deleted: null,
		target: null,
		sortOrder: 0,
		id: Math.random(),
		stateId: null,
		parentId: null,
		private: _private ? _private : true,
		readLater: readLater ? readLater : false,
	};
};

export const bookmarkExtended = Prisma.validator<Prisma.BookmarkInclude>()({
	state: true,
	entry: {
		include: {
			annotations: true,
			interactions: true,
		},
	},
});
export const annotationExtendedInclude = Prisma.validator<Prisma.AnnotationInclude>()({
	children: true,
	state: true,
	entry: {
		include: {
			annotations: true,
			interactions: true,
		},
	},
});
const annotationExtended = Prisma.validator<Prisma.AnnotationArgs>()({
	include: annotationExtendedInclude,
});

export type ExtendedAnnotation = Prisma.AnnotationGetPayload<typeof annotationExtended>;

export const TextQuoteSelectorSchema = z.object({
	type: z.literal('TextQuoteSelector'),
	exact: z.string(),
	prefix: z.string().optional(),
	suffix: z.string().optional(),
});

export const XPathSelectorSchema = z.object({
	type: z.literal('XPathSelector'),
	value: z.string(),
});

// TODO: this is not really complete but it works for now
export const RangeSelectorSchema = z.object({
	type: z.literal('RangeSelector'),
	startSelector: z.union([TextQuoteSelectorSchema, XPathSelectorSchema]),
	endSelector: z.union([TextQuoteSelectorSchema, XPathSelectorSchema]),
});

export const SelectorSchema = z.union([
	XPathSelectorSchema,
	TextQuoteSelectorSchema,
	RangeSelectorSchema,
]);
export type Selector = z.infer<typeof SelectorSchema>;

export const TargetSchema = z.object({
	source: z.string(),
	selector: SelectorSchema,
	html: z.string().optional(),
});

export type TargetSchema = z.infer<typeof TargetSchema>;

const CreateAnnotationInput = z.object({
	type: z.literal('annotation'),
	body: z.string(),
	id: z.number().optional(),
	userId: z.string(),
	private: z.boolean().optional(),
	target: TargetSchema,
	entryId: z.number().optional(),
	tags: z.string().array(),
	entry: z
		.object({
			connect: z.object({
				id: z.number().optional(),
				uri: z.string().optional(),
			}),
		})
		.optional(),
});

export const connectOrCreateTaggings = ({ id, name }: { id: number; name: string }) => {
	return Prisma.validator<Prisma.TaggingsCreateOrConnectWithoutAnnotationInput>()({
		where: {},
	});
};

export const validateAnnotationInput = ({
	private: _private,
	target,
	body,
	userId,
	entryId,
	tags,
	id,
}: {
	private?: boolean;
	target: TargetSchema;
	body: string;
	userId: string;
	entryId?: number;
	id?: number;
	tags?:
		| string[]
		| {
				name: string;
				id?: number; // this would be useful...
		  }[];
}) => {
	return Prisma.validator<Prisma.AnnotationCreateInput>()({
		type: 'annotation',
		body,
		target,
		creator: {
			connect: {
				id: userId,
			},
		},
		entry: {
			connect: {
				id: entryId,
			},
		},
		tags: {
			connectOrCreate: tags?.map((tag) => {
				const s = typeof tag === 'string';
				console.log({ tag });
				return {
					where: {
						// -1 so that it doesn't throw errors
						id: !s ? tag.id || -1 : -1,
					},
					create: {
						user: {
							connect: {
								id: userId,
							},
						},
						tag:
							!s && tag.id
								? {
										connectOrCreate: {
											where: {
												id: !s ? tag.id : -1,
												name_userId: {
													name: s ? tag : tag.name,
													userId,
												},
											},
											create: {
												name: s ? tag : tag.name,
												user: {
													connect: {
														id: userId,
													},
												},
											},
										},
								  }
								: {
										create: {
											name: s ? tag : tag.name,
											user: {
												connect: {
													id: userId,
												},
											},
										},
								  },
					},
				};
			}),
		},
	});
};

export type ValidatedAnnotationInput = ReturnType<typeof validateAnnotationInput>;

export const upsertAnnotation = async (data: {
	private?: boolean;
	target: TargetSchema;
	body: string;
	userId: string;
	entryId?: number;
	id?: number;
	tags?:
		| string[]
		| {
				name: string;
				id?: number; // this would be useful...
		  }[];
}) => {
	try {
		// if (data.id) {
		//     const a = Prisma.validator<Prisma.AnnotationUpsertArgs>()({
		//         where
		//     })
		// 	// upsert...
		// }
		let body;
		const a = validateAnnotationInput({ ...data });
		let res: Response;
		if (data.id) {
			//upsert
			res = await fetch(`/api/annotations/${data.id}`, {
				method: 'PATCH',
				body: JSON.stringify(a),
			});
		} else {
			res = await fetch(`/api/annotations`, {
				method: 'POST',
				body: JSON.stringify(a),
			});
		}
		const annotation = await res.json();
		return annotation as Annotation;
	} catch (e) {
		console.error(e);
	}
};
