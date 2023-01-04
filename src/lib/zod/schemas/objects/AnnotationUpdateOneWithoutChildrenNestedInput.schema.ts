import { z } from 'zod';
import { AnnotationCreateWithoutChildrenInputObjectSchema } from './AnnotationCreateWithoutChildrenInput.schema';
import { AnnotationUncheckedCreateWithoutChildrenInputObjectSchema } from './AnnotationUncheckedCreateWithoutChildrenInput.schema';
import { AnnotationCreateOrConnectWithoutChildrenInputObjectSchema } from './AnnotationCreateOrConnectWithoutChildrenInput.schema';
import { AnnotationUpsertWithoutChildrenInputObjectSchema } from './AnnotationUpsertWithoutChildrenInput.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateToOneWithWhereWithoutChildrenInputObjectSchema } from './AnnotationUpdateToOneWithWhereWithoutChildrenInput.schema';
import { AnnotationUpdateWithoutChildrenInputObjectSchema } from './AnnotationUpdateWithoutChildrenInput.schema';
import { AnnotationUncheckedUpdateWithoutChildrenInputObjectSchema } from './AnnotationUncheckedUpdateWithoutChildrenInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateOneWithoutChildrenNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutChildrenInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutChildrenInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => AnnotationCreateOrConnectWithoutChildrenInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => AnnotationUpsertWithoutChildrenInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => AnnotationWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => AnnotationWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => AnnotationWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => AnnotationUpdateToOneWithWhereWithoutChildrenInputObjectSchema),
				z.lazy(() => AnnotationUpdateWithoutChildrenInputObjectSchema),
				z.lazy(() => AnnotationUncheckedUpdateWithoutChildrenInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const AnnotationUpdateOneWithoutChildrenNestedInputObjectSchema = Schema;
