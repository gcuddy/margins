import { z } from 'zod';
import type {
	CssSelector,
	TextPositionSelector as ITextPositionSelector,
} from './annotator/types';
import { jsonSchema } from './schemas/types';

export const AnnotationType = {
	bookmark: 'bookmark',
	note: 'note',
	annotation: 'annotation',
	reply: 'reply',
	document: 'document',
	qa: 'qa',
} as const;

export const CssSelectorSchema: z.ZodType<CssSelector> = z.object({
	type: z.literal('CssSelector'),
	value: z.string(),
});

const TimestampSelectorSchema = z.object({
	// source: z.string()   ,
	// selector: z.object({
	type: z.literal('FragmentSelector').default('FragmentSelector'),
	conformsTo: z
		.literal('http://www.w3.org/TR/media-frags/')
		.default('http://www.w3.org/TR/media-frags/'),
	/**  e.g. "t=10,20" */
	value: z.string(),
	// }),
	// html: z.string().optional(),
});

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

const TextPositionSelector: z.ZodType<ITextPositionSelector> = z.object({
	type: z.literal('TextPositionSelector'),
	start: z.number(),
	end: z.number(),
});

// TODO: this is not really complete but it works for now
export const RangeSelectorSchema = z.object({
	type: z.literal('RangeSelector'),
	startSelector: z.union([TextQuoteSelectorSchema, XPathSelectorSchema]),
	endSelector: z.union([TextQuoteSelectorSchema, XPathSelectorSchema]),
});

// This is our own extension
export const BookSelectorSchema = z.object({
	type: z.literal('BookSelector'),
	// Value is optional - we could just be noting the page num, and the body contains our annotation
	value: z.string().optional(),
	pageNumber: z.number(),
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
	source: z.string(),
	selector: SelectorSchema.or(
		z.tuple([TextQuoteSelectorSchema, TextPositionSelector]),
	)
		.or(z.tuple([TextQuoteSelectorSchema, BookSelectorSchema]))
		.or(z.array(SelectorSchema)),
	html: z.string().optional(),
	page_num: z.number().optional(),
});

export type TargetSchema = z.infer<typeof TargetSchema>;

export const annotationSchema = z.object({
	type: z.nativeEnum(AnnotationType).optional(),
	body: z.string().nullish(),
	id: z.string().optional(),
	userId: z.string(),
	private: z.boolean().nullish(),
	title: z.string().nullish(),
	target: TargetSchema.nullish(),
	entryId: z.number().nullish(),
	contentData: jsonSchema.nullish(),
	color: z.string().nullish(), // Hex code for the color of the annotation
	icon: z.string().nullish(), // Emoji as :emoji: or icon name with CamelCase (first letter capitalized)
	deleted: z.coerce.date().nullish(),
	html: z.string().nullish(),
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
