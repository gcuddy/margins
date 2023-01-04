import { z } from 'zod';

export const LocationSchema = z.enum(['inbox', 'soon', 'later', 'archive']);
