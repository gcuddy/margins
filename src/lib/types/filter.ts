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

type _StringFilter = {
	field: 'title' | 'author' | 'url' | 'siteName';
	type: 'StringFilter';
	display?: string;
	filter: StringFilterType;
	value: string;
	id: number;
};

type _IntFilter = {
	field: 'readProgress';
	type: 'NumberFilter';
	display?: string;
	filter: IntFilterType;
	value: number;
	id: number;
};

export type SmartListCondition = _StringFilter | _IntFilter;
