import { z } from 'zod';
import { AnnotationCreateWithoutTagsInputObjectSchema } from './AnnotationCreateWithoutTagsInput.schema';
import { AnnotationUncheckedCreateWithoutTagsInputObjectSchema } from './AnnotationUncheckedCreateWithoutTagsInput.schema';
import { AnnotationCreateOrConnectWithoutTagsInputObjectSchema } from './AnnotationCreateOrConnectWithoutTagsInput.schema';
import { AnnotationUpsertWithoutTagsInputObjectSchema } from './AnnotationUpsertWithoutTagsInput.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateToOneWithWhereWithoutTagsInputObjectSchema } from './AnnotationUpdateToOneWithWhereWithoutTagsInput.schema';
import { AnnotationUpdateWithoutTagsInputObjectSchema } from './AnnotationUpdateWithoutTagsInput.schema';
import { AnnotationUncheckedUpdateWithoutTagsInputObjectSchema } from './AnnotationUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateOneWithoutTagsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutTagsInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => AnnotationCreateOrConnectWithoutTagsInputObjectSchema).optional(),
		upsert: z.lazy(() => AnnotationUpsertWithoutTagsInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => AnnotationWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => AnnotationWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => AnnotationWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => AnnotationUpdateToOneWithWhereWithoutTagsInputObjectSchema),
				z.lazy(() => AnnotationUpdateWithoutTagsInputObjectSchema),
				z.lazy(() => AnnotationUncheckedUpdateWithoutTagsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const AnnotationUpdateOneWithoutTagsNestedInputObjectSchema = Schema;
