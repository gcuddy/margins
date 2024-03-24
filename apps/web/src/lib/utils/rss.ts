import type { RssFeedWithItems } from '$lib/types/rss';
import dayjs from 'dayjs';

export function sortItemsFromFeeds(feeds: RssFeedWithItems[], unreadOnly = false) {
	console.time('sortItemsFromFeeds');
	const items = feeds.flatMap((feed) => feed.items);

	const sortedItems = items.sort((a, b) => {
		return dayjs(b.pubDate).diff(dayjs(a.pubDate));
	});

	if (unreadOnly) {
		const filteredItems = sortedItems.filter((item) => item.is_read === false);
		console.timeEnd('sortItemsFromFeeds');
		return filteredItems;
	} else {
		console.timeEnd('sortItemsFromFeeds');
		return sortedItems;
	}
}
