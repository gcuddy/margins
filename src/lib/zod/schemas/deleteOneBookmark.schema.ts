import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './objects/BookmarkWhereUniqueInput.schema';

export const BookmarkDeleteOneSchema = z.object({ where: BookmarkWhereUniqueInputObjectSchema });
