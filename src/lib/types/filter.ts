import type { Prisma } from '@prisma/client';

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

const STRING_FIELDS = ['title', 'author', 'url', 'siteName', 'textContent', 'location'] as const;

type _StringFilter = {
	field: typeof STRING_FIELDS[number];
	type: 'StringFilter';
	display?: string;
	filter: StringFilterType;
	value: string;
	id: number;
};

const NUMBER_FIELDS = ['readProgress', 'wordCount'];

type _IntFilter = {
	field: typeof NUMBER_FIELDS[number];
	type: 'NumberFilter';
	display?: string;
	filter: IntFilterType;
	value: number;
	id: number;
};

const BOOL_FIELDS = ['starred'];

type _BoolFilter = {
	field: typeof BOOL_FIELDS[number];
	type: 'BoolFilter';
	display?: string;
	filter: BoolFilterType;
	value: boolean;
	id: number;
};

const DATE_FIELDS = ['createdAt', 'updatedAt', 'date'];
type _DateTimeFilter = {
	field: typeof DATE_FIELDS[number];
	type: 'DateTimeFilter';
	display?: string;
	filter: DateTimeFilterType;
	value: Date;
	id: number;
};

const SEARCH_FIELDS = ['textContent'];

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
