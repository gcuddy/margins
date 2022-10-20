import { z } from 'zod';
import type { IntFilterType } from '../filter';
import { ViewOptionsSchema } from './View';

export const ArticleFilterSchema = z.object({
	title: z.object({
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		equals: z.string().optional(),
	}),
});

export const IntFilterSchema = z.object({
	equals: z.number().optional(),
	in: z.array(z.number()).optional(),
	notIn: z.array(z.number()).optional(),
	lt: z.number().optional(),
	lte: z.number().optional(),
	gt: z.number().optional(),
	gte: z.number().optional(),
	not: z.number().optional(),
});

export const StringFilterSchema = z.object({
	equals: z.string().optional(),
	in: z.array(z.string()).optional(),
	notIn: z.array(z.string()).optional(),
	lt: z.string().optional(),
	lte: z.string().optional(),
	gt: z.string().optional(),
	gte: z.string().optional(),
	contains: z.string().optional(),
	startsWith: z.string().optional(),
	endsWith: z.string().optional(),
	search: z.string().optional(),
	not: z.string().optional(),
});

export const DateTimeFilterSchema = z.object({
	equals: z.date().or(z.string()).optional(),
	lt: z.date().or(z.string()).optional(),
	lte: z.date().or(z.string()).optional(),
	gt: z.date().or(z.string()).optional(),
	gte: z.date().or(z.string()).optional(),
	not: z.date().or(z.string()).optional(),
});

export const SmartListSchema = z.object({
	AND: z.object({}),
});
type _IntFilter = {
	field: 'readProgress';
	type: 'NumberFilter';
	display?: string;
	filter: IntFilterType;
	value: number;
	id: number;
};

type _StringFilter = {
	field: 'title' | 'author' | 'url' | 'siteName';
	type: 'StringFilter';
	display?: string;
	filter: StringFilterType;
	value: string;
	id: number;
};

// is there a way to just get z.string from an objcet?
export const SmartListStringFilter = z.object({
	field: ArticleModel.pick({
		title: true,
		author: true,
		url: true,
		siteName: true,
	}).keyof(),
	type: z.literal('StringFilter'),
	display: z.string().optional(),
	filter: StringFilterSchema.keyof(),
	value: z.string(),
	id: z.number(),
});

export const BoolFilterSchema = z.object({
	equals: z.boolean().optional(),
	not: z.boolean().optional(),
});

// export type ArticleWhereInput = {
// 	id?: IntFilter | number;
// 	title?: StringFilter | string;
// 	content?: StringFilter | string;
// 	textContent?: StringFilter | string;
// 	author?: StringFilter | string;
// 	createdAt?: DateTimeFilter | Date | string;
// 	updatedAt?: DateTimeFilter | Date | string;
// 	readProgress?: FloatFilter | number;
// 	url?: StringFilter | string;
// 	siteName?: StringNullableFilter | string | null;
// 	colorHash?: StringNullableFilter | string | null;
// 	date?: DateTimeFilter | Date | string;
// 	image?: StringFilter | string;
// 	wordCount?: IntFilter | number;
// 	starred?: BoolFilter | boolean;
// 	css?: StringNullableFilter | string | null;
// 	description?: StringNullableFilter | string | null;
// 	wiki?: StringNullableFilter | string | null;
// 	classification?: StringNullableFilter | string | null;
// 	pdf?: BoolNullableFilter | boolean | null;
// 	html?: StringNullableFilter | string | null;
// 	position?: IntFilter | number;
// 	trash?: BoolFilter | boolean;
// 	location?: StringFilter | string;
// 	annotations?: AnnotationListRelationFilter;
// 	Bookmark?: XOR<BookmarkRelationFilter, BookmarkWhereInput> | null;
// 	context?: XOR<ContextRelationFilter, ContextWhereInput> | null;
// 	highlights?: HighlightListRelationFilter;
// 	Highlight2?: Highlight2ListRelationFilter;
// 	ListItem?: XOR<ListItemRelationFilter, ListItemWhereInput> | null;
// 	media?: XOR<MediaRelationFilter, MediaWhereInput> | null;
// 	tags?: TagListRelationFilter;
// 	favorite?: XOR<FavoriteRelationFilter, FavoriteWhereInput> | null;
// 	RssInteraction?: RssInteractionListRelationFilter;
// };

// currently have to manually keep this in sync with Prisma.ArticleWhereInput
export const ArticleWhereSchema = z.object({
	title: StringFilterSchema.optional(),
	textContent: StringFilterSchema.optional(),
	author: StringFilterSchema.optional(),
	createdAt: DateTimeFilterSchema.optional(),
	updatedAt: DateTimeFilterSchema.optional(),
	readProgress: IntFilterSchema.optional(),
	url: StringFilterSchema.optional(),
	date: DateTimeFilterSchema.optional(),
	wordCount: IntFilterSchema.optional(),
	starred: BoolFilterSchema.optional(),
	// make location be one of Inbox, Archive, etc
	location: StringFilterSchema.optional(),
});
const articleWhereKeys = ArticleWhereSchema.keyof();
export const stringFilterKeys: z.infer<typeof articleWhereKeys>[] = [
	'title',
	'textContent',
	'author',
	'url',
	'location',
];
const dateTimeFilterKeys: z.infer<typeof articleWhereKeys>[] = ['createdAt', 'updatedAt', 'date'];
const intFilterKeys: z.infer<typeof articleWhereKeys>[] = ['readProgress', 'wordCount'];
const boolFilterKeys: z.infer<typeof articleWhereKeys>[] = ['starred'];

// {"AND":[{"author":{"mode":"insensitive","contains":"tooze"}}]}

export const SmartListFilterSchema = z.object({
	AND: z.array(ArticleWhereSchema).optional(),
	OR: z.array(ArticleWhereSchema).optional(),
	NOT: z.array(ArticleWhereSchema).optional(),
});
// export const SmartListFilterSchema = z.union([
// 	z.object({
// 		AND: z.array(ArticleWhereSchema)
// 	}),
// 	z.object({
// 		OR: z.array(ArticleWhereSchema)
// 	}),
// 	z.object({
// 		NOT: z.array(ArticleWhereSchema)
// 	})
// ]);

function whereToSmartConditions(where: z.infer<typeof ArticleWhereSchema>): SmartListCondition {
	// WE ONLY SUPPORT ONE KEY
	const key = (Object.keys(where) as (keyof typeof where)[])[0];

	// JUST ONE
	const _value = where[key];
	if (!_value) {
		throw Error('where value is null');
	}
	const allKeys = IntFilterSchema.keyof()
		.and(StringFilterSchema.keyof())
		.and(DateTimeFilterSchema.keyof())
		.and(BoolFilterSchema.keyof());
	const value: z.infer<typeof allKeys> = (Object.keys(_value) as (keyof typeof _value)[])[0];
	const type = stringFilterKeys.includes(key)
		? 'StringFilter'
		: dateTimeFilterKeys.includes(key)
		? 'DateTimeFilter'
		: intFilterKeys.includes(key)
		? 'NumberFilter'
		: boolFilterKeys.includes(key)
		? 'BoolFilter'
		: 'StringFilter';
	return {
		type,
		field: key,
		display: lookup[key].display,
		filter: value,
	};
	// const result1 = (Object.keys(where) as (keyof typeof where)[]).forEach((key) => {
	// 	key; // 'AND' | 'OR' | 'NOT'
	// 	const a = ArticleWhereSchema.shape[key];
	// 	a === StringFilterSchema;
	// 	const t = a.parse(where[key]);
	// });
	// return conditions;
}

// TODO: keep in sync my god!
export const lookup = {
	author: {
		display: 'Author',
		type: 'StringFilter',
	},
	title: {
		display: 'Title',
		type: 'StringFilter',
	},
	textContent: {
		display: 'Text Content',
		type: 'StringFilter',
	},
	url: {
		display: 'URL',
		type: 'StringFilter',
	},
	location: {
		display: 'Location',
		type: 'StringFilter',
	},
	createdAt: {
		display: 'Created At',
		type: 'DateTimeFilter',
	},
	updatedAt: {
		display: 'Updated At',
		type: 'DateTimeFilter',
	},
	readProgress: {
		display: 'Read Progress',
		type: 'NumberFilter',
	},
	date: {
		display: 'Date',
		type: 'DateTimeFilter',
	},
	wordCount: {
		display: 'Word Count',
		type: 'NumberFilter',
	},
	starred: {
		display: 'Starred',
		type: 'BoolFilter',
	},
};

export const SmartListModelSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	filter: SmartListFilterSchema,
	viewOptions: ViewOptionsSchema,
});
