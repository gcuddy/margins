import { ArticleModel, FavoriteModel, RssFeedModel } from '$lib/types/schemas/prisma';
import { writable, type Readable } from 'svelte/store';
import { z } from 'zod';

export const User = z.object({
	username: z.string(),
	feeds: RssFeedModel.array(),
	favorites: FavoriteModel.array(),
	articles: ArticleModel.array(),
});
export type User = z.infer<typeof User>;

export const user = writable<z.infer<typeof User>>();

export type UserStoreType = typeof user | Readable<User>;
