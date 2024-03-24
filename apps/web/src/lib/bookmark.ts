import type { Prisma } from '@prisma/client';

import type { getBookmarks } from './bookmark.server';

export type ExtendedBookmark = Prisma.PromiseReturnType<typeof getBookmarks>[number];
