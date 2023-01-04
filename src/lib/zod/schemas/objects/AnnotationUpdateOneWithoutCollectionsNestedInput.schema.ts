import { z } from 'zod';
import { AnnotationCreateWithoutCollectionsInputObjectSchema } from './AnnotationCreateWithoutCollectionsInput.schema';
import { AnnotationUncheckedCreateWithoutCollectionsInputObjectSchema } from './AnnotationUncheckedCreateWithoutCollectionsInput.schema';
import { AnnotationCreateOrConnectWithoutCollectionsInputObjectSchema } from './AnnotationCreateOrConnectWithoutCollectionsInput.schema';
import { AnnotationUpsertWithoutCollectionsInputObjectSchema } from './AnnotationUpsertWithoutCollectionsInput.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateToOneWithWhereWithoutCollectionsInputObjectSchema } from './AnnotationUpdateToOneWithWhereWithoutCollectionsInput.schema';
import { AnnotationUpdateWithoutCollectionsInputObjectSchema } from './AnnotationUpdateWithoutCollectionsInput.schema';
import { AnnotationUncheckedUpdateWithoutCollectionsInputObjectSchema } from './AnnotationUncheckedUpdateWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateOneWithoutCollectionsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutCollectionsInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutCollectionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => AnnotationCreateOrConnectWithoutCollectionsInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => AnnotationUpsertWithoutCollectionsInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => AnnotationWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => AnnotationWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => AnnotationWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => AnnotationUpdateToOneWithWhereWithoutCollectionsInputObjectSchema),
				z.lazy(() => AnnotationUpdateWithoutCollectionsInputObjectSchema),
				z.lazy(() => AnnotationUncheckedUpdateWithoutCollectionsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const AnnotationUpdateOneWithoutCollectionsNestedInputObjectSchema = Schema;
