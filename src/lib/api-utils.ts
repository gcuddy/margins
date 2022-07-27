import { Prisma } from '@prisma/client';
import { z } from 'zod';

export function reportZodOrPrismaError(e: any) {
	// TODO: probably check the code and make this more robust
	if (e instanceof z.ZodError || e instanceof Prisma.PrismaClientKnownRequestError) {
		return e.message;
	}
}
