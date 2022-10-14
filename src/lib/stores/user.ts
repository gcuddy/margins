import {
	ArticleModel,
	FavoriteModel,
	RssFeedItemModel,
	RssFeedModel,
} from '$lib/types/schemas/prisma';
import { derived, writable, type Readable } from 'svelte/store';
import { z } from 'zod';

export const User = z.object({
	username: z.string(),
	feeds: RssFeedModel.array(),
	// todo: for storing cursor, should we store it itself or should it just be the last item in the array?
	feedItems: RssFeedItemModel.array(),
	favorites: FavoriteModel.array(),
	articles: ArticleModel.array(),
});
export type User = z.infer<typeof User>;

function createUserStore() {
	const { subscribe, set, update } = writable<User>();
	const updateData = async (
		data: 'articles' | 'feeds' | 'favorites',
		{ access_token }: { access_token: string }
	) => {
		//todo: args
		const res = await fetch(`/api/fetch_user_data?data=${data}`);
		user_data_dirty.set(false);
		if (res.ok) {
			const fetchedData = await res.json();
			console.log({ fetchedData });
			update((user) => {
				if (user) {
					return {
						...user,
						[data]: fetchedData[data],
					};
				}
			});
		}
		if (!res.ok) {
			console.log({ res });
		}
	};
	return {
		subscribe,
		set,
		update,
		updateData,
	};
}

export const user = createUserStore();
export const user_data_dirty = writable(false);

export type UserStoreType = typeof user | Readable<User>;

export const sidebarFeeds = derived(user, ($user) => {
	if ($user?.feeds?.length) {
		return $user.feeds.map((feed) => {
			return {
				display: feed.title,
				href: `/rss/${feed.id}`,
				img: feed.imageUrl
					? feed.imageUrl
					: `https://icon.horse/icon/?uri=${feed.link || feed.feedUrl}`,
			};
		});
	}
	return [];
});
