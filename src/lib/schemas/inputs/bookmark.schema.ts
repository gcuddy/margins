import { Status } from '@prisma/client';
import { z } from 'zod';

export const bookmarkCreateInput = z.object({
    relatedEntryId: z.number().int().optional(),
    status: z.nativeEnum(Status).default("Backlog"),
    url: z.string(),
});

export type BookmarkCreateInput = z.input<typeof bookmarkCreateInput>;
