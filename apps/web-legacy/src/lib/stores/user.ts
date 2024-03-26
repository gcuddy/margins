import type { Article, Favorite, RssFeed, RssFeedItem } from '@prisma/client';
import { derived, writable, type Readable } from 'svelte/store';

export type User = {
	email: string;
	feeds: RssFeed[];
	feedItems: RssFeedItem[];
	favorites: Favorite[];
	articles: Article[];
};

function createUserStore() {
	const { subscribe, set, update } = writable<User>();
	const updateData = async (data: 'articles' | 'feeds' | 'favorites') => {
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
