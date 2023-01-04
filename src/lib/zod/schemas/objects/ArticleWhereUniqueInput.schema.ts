import { z } from 'zod';
import { ArticleUserIdUrlCompoundUniqueInputObjectSchema } from './ArticleUserIdUrlCompoundUniqueInput.schema';
import { ArticleWhereInputObjectSchema } from './ArticleWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { BoolNullableFilterObjectSchema } from './BoolNullableFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		userId_url: z.lazy(() => ArticleUserIdUrlCompoundUniqueInputObjectSchema).optional(),
		AND: z
			.union([
				z.lazy(() => ArticleWhereInputObjectSchema),
				z.lazy(() => ArticleWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => ArticleWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => ArticleWhereInputObjectSchema),
				z.lazy(() => ArticleWhereInputObjectSchema).array(),
			])
			.optional(),
		title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		content: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		textContent: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		author: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		private: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		readProgress: z
			.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		slug: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		url: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		siteName: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		colorHash: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		date: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		image: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		wordCount: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		starred: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		css: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		description: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		wiki: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		classification: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		pdf: z
			.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()])
			.optional()
			.nullable(),
		html: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		readLater: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		bookmark: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		position: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		trash: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		location: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		type: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		favoriteId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const ArticleWhereUniqueInputObjectSchema = Schema;
