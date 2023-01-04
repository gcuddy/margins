import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './objects/BookmarkWhereUniqueInput.schema';

export const BookmarkFindUniqueSchema = z.object({ where: BookmarkWhereUniqueInputObjectSchema });
