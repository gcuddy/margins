import type { Prisma } from '@prisma/client';
import { z } from 'zod';

// Make mutually exclusive
export type PrismaStringFilter =
	| {
		contains: string;
		startsWith?: never;
		endsWith?: never;
		equals?: never;
	}
	| {
		startsWith: string;
		contains?: never;
		endsWith?: never;
		equals?: never;
	}
	| {
		endsWith: string;
		contains?: never;
		startsWith?: never;
		equals?: never;
	}
	| {
		equals: string;
		contains?: never;
		startsWith?: never;
		endsWith?: never;
	};

export type FilterField = keyof Omit<Prisma.ArticleWhereInput, 'id' | 'AND' | 'OR' | 'NOT'>;
// export type FilterField = Omit<keyof Prisma.ArticleWhereInput, 'id' | 'AND' | 'OR' | 'NOT'>;

// type SmartListFilter = {
// 	[key in FilterField]: PrismaStringFilter | PrismaStringFilter[];
// };

// const filter: SmartListFilter = {
// 	author: {
// 		contains: ''
// 	}
// };

export type StringFilterType = keyof Prisma.StringFilter;
export type IntFilterType = keyof Prisma.IntFilter;
export type BoolFilterType = keyof Prisma.BoolFilter;
export type DateTimeFilterType = keyof Prisma.DateTimeFilter;

// TODO: keep this in sync with zod over in SmartList.ts

const STRING_FIELDS = ['title', 'author', 'uri', 'siteName', 'text', 'location'] as const;

type _StringFilter = {
	field: typeof STRING_FIELDS[number];
	type: 'StringFilter';
	display?: string;
	filter: StringFilterType;
	value: string;
	id: number;
};

const NUMBER_FIELDS = ['readProgress', 'wordCount'] as const;

type _IntFilter = {
	field: typeof NUMBER_FIELDS[number];
	type: 'NumberFilter';
	display?: string;
	filter: IntFilterType;
	value: number;
	id: number;
};

const BOOL_FIELDS = ['unread'] as const;

type _BoolFilter = {
	field: typeof BOOL_FIELDS[number];
	type: 'BoolFilter';
	display?: string;
	filter: BoolFilterType;
	value: boolean;
	id: number;
};

const DATE_FIELDS = ['createdAt', 'updatedAt', 'published'] as const;
type _DateTimeFilter = {
	field: typeof DATE_FIELDS[number];
	type: 'DateTimeFilter';
	display?: string;
	filter: DateTimeFilterType;
	value: Date;
	id: number;
};

const SEARCH_FIELDS = ['text'] as const;

type _SearchFilter = {
	field: typeof SEARCH_FIELDS[number];
	type: 'SearchFilter';
	display?: string;
	filter: 'search';
	value: string;
	id: number;
};

export type SmartListCondition =
	| _StringFilter
	| _IntFilter
	| _BoolFilter
	| _DateTimeFilter
	| _SearchFilter;


const _BaseFilter = z.object({
	id: z.number(),
	display: z.string().optional()
})


export const _StringFilter = _BaseFilter.extend({
	field: z.enum(STRING_FIELDS),
	type: z.literal("StringFilter"),
	value: z.string(),
	filter: z.enum(["contains"]),
})

export const _IntFilter = _BaseFilter.extend({
	field: z.enum(NUMBER_FIELDS),
	type: z.literal("NumberFilter"),
	value: z.number(),
	filter: z.enum(["equals", "lt", "lte", "gt", "gte", "not"]),
})

export const _BoolFilter = _BaseFilter.extend({
	field: z.enum(BOOL_FIELDS),
	type: z.literal("BoolFilter"),
	value: z.boolean(),
})

export const _DateTimeFilter = _BaseFilter.extend({
	field: z.enum(DATE_FIELDS),
	type: z.literal("DateTimeFilter"),
	value: z.string().datetime(),
	filter: z.enum(["lte", "gte"])
})

export const _SearchFilter = _BaseFilter.extend({
	field: z.enum(SEARCH_FIELDS),
	type: z.literal("SearchFilter"),
	value: z.string(),
	filter: z.enum(["search"])
})

export const SmartListCondition = z.union([
	_StringFilter,
	_IntFilter,
	_BoolFilter,
	_DateTimeFilter,
	_SearchFilter
])

export const matchFieldToType = (
	field: SmartListCondition['field']
): SmartListCondition['type'] | undefined => {
	if (STRING_FIELDS.includes(field as any)) {
		return 'StringFilter';
	} else if (NUMBER_FIELDS.includes(field as any)) {
		return 'NumberFilter';
	} else if (BOOL_FIELDS.includes(field as any)) {
		return 'BoolFilter';
	} else if (DATE_FIELDS.includes(field as any)) {
		return 'DateTimeFilter';
	} else if (SEARCH_FIELDS.includes(field as any)) {
		return 'SearchFilter';
	}
};
