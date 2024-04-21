import { z } from 'zod';
import type {
	CssSelector,
	TextPositionSelector as ITextPositionSelector,
} from './annotator/types.js';
// import { jsonSchema } from './schemas/types';

export const AnnotationType = {
	annotation: 'annotation',
	bookmark: 'bookmark',
	document: 'document',
	note: 'note',
	qa: 'qa',
	reply: 'reply',
} as const;

export const CssSelectorSchema: z.ZodType<CssSelector> = z.object({
	type: z.literal('CssSelector'),
	value: z.string(),
});

const TimestampSelectorSchema = z.object({
	conformsTo: z
		.literal('http://www.w3.org/TR/media-frags/')
		.default('http://www.w3.org/TR/media-frags/'),
	// source: z.string()   ,
	// selector: z.object({
	type: z.literal('FragmentSelector').default('FragmentSelector'),
	/**  e.g. "t=10,20" */
	value: z.string(),
	// }),
	// html: z.string().optional(),
});

export const TextQuoteSelectorSchema = z.object({
	exact: z.string(),
	prefix: z.string().optional(),
	suffix: z.string().optional(),
	type: z.literal('TextQuoteSelector'),
});

export const XPathSelectorSchema = z.object({
	type: z.literal('XPathSelector'),
	value: z.string(),
});

const TextPositionSelector: z.ZodType<ITextPositionSelector> = z.object({
	end: z.number(),
	start: z.number(),
	type: z.literal('TextPositionSelector'),
});

// TODO: this is not really complete but it works for now
export const RangeSelectorSchema = z.object({
	endSelector: z.union([TextQuoteSelectorSchema, XPathSelectorSchema]),
	startSelector: z.union([TextQuoteSelectorSchema, XPathSelectorSchema]),
	type: z.literal('RangeSelector'),
});

// This is our own extension
export const BookSelectorSchema = z.object({
	pageNumber: z.number(),

	type: z.literal('BookSelector'),
	// Value is optional - we could just be noting the page num, and the body contains our annotation
	value: z.string().optional(),
});

export const SelectorSchema = z.union([
	XPathSelectorSchema,
	TextQuoteSelectorSchema,
	RangeSelectorSchema,
	TimestampSelectorSchema,
	BookSelectorSchema,
	TextPositionSelector,
	CssSelectorSchema,
]);
export type Selector = z.infer<typeof SelectorSchema>;

export const TargetSchema = z.object({
	html: z.string().optional(),
	page_num: z.number().optional(),
	selector: SelectorSchema.or(
		z.tuple([TextQuoteSelectorSchema, TextPositionSelector]),
	).or(z.tuple([TextQuoteSelectorSchema, BookSelectorSchema])),
	// source: z.string(),
});

export type TargetSchema = z.infer<typeof TargetSchema>;

export const annotationSchema = z.object({
	body: z.string().nullish(),
	color: z.string().nullish(),
	// contentData: jsonSchema.nullish(),
	// Emoji as :emoji: or icon name with CamelCase (first letter capitalized)
	deleted: z.coerce.date().nullish(),

	entryId: z.number().nullish(),

	html: z.string().nullish(),

	// Hex code for the color of the annotation
	icon: z.string().nullish(),

	id: z.string().optional(),

	private: z.boolean().nullish(),

	target: TargetSchema.nullish(),

	title: z.string().nullish(),

	type: z.nativeEnum(AnnotationType).optional(),

	userId: z.string(),
	// tags: z.string().array(),
	// entry: z
	//     .object({
	//         connect: z.object({
	//             id: z.number().optional(),
	//             uri: z.string().optional(),
	//         }),
	//     })
	//     .optional(),
});

export type Annotation = z.infer<typeof annotationSchema>;
export type AnnotationSchema = typeof annotationSchema;
