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
type _StringFilter = {
	field: 'title' | 'author' | 'url' | 'siteName' | 'textContent' | 'location';
	type: 'StringFilter';
	display?: string;
	filter: StringFilterType;
	value: string;
	id: number;
};
type _IntFilter = {
	field: 'readProgress' | 'wordCount';
	type: 'NumberFilter';
	display?: string;
	filter: IntFilterType;
	value: number;
	id: number;
};
type _BoolFilter = {
	field: 'starred';
	type: 'BoolFilter';
	display?: string;
	filter: BoolFilterType;
	value: boolean;
	id: number;
};
type _DateTimeFilter = {
	field: 'createdAt' | 'updatedAt' | 'date';
	type: 'DateTimeFilter';
	display?: string;
	filter: DateTimeFilterType;
	value: Date;
	id: number;
};

export type SmartListCondition = _StringFilter | _IntFilter | _BoolFilter | _DateTimeFilter;
