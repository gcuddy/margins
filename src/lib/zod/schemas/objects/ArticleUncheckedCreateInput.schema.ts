import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleUncheckedCreateInput> = z
	.object({
		id: z.number().optional(),
		title: z.string(),
		content: z.string().optional().nullable(),
		textContent: z.string().optional().nullable(),
		author: z.string().optional().nullable(),
		private: z.boolean().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		readProgress: z.number().optional().nullable(),
		slug: z.string().optional().nullable(),
		url: z.string().optional().nullable(),
		siteName: z.string().optional().nullable(),
		colorHash: z.string().optional().nullable(),
		date: z.date().optional().nullable(),
		image: z.string().optional().nullable(),
		wordCount: z.number().optional().nullable(),
		starred: z.boolean().optional(),
		css: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
		wiki: z.string().optional().nullable(),
		classification: z.string().optional().nullable(),
		pdf: z.boolean().optional().nullable(),
		html: z.string().optional().nullable(),
		readLater: z.boolean().optional(),
		bookmark: z.boolean().optional(),
		position: z.number().optional(),
		trash: z.boolean().optional(),
		location: z.string().optional(),
		type: z.number().optional(),
		userId: z.string(),
		favoriteId: z.number().optional().nullable(),
	})
	.strict();

export const ArticleUncheckedCreateInputObjectSchema = Schema;
