import { db } from '$lib/db';

// TODO: entries vs bookmarks
// maybe to match everything else we should return bookmarks.
// Hm. Entries would get all, regardless if it has any public annotations. hm. let's think about this.
export const getEntriesForAuthor = async ({ userId, name }: { userId?: string; name: string }) => {
	const articles = await db.entry.findMany({
		where: {
			author: {
				equals: name,
			},
			// We fiter for only entries with an annotation.
			// If we've provided a userId, then we can get all entries regardles if the annotation is public.
			// Otherwise, we'll get only entries that have at least 1 public annotation.
			annotations: userId
				? {
						every: {
							userId,
						},
				  }
				: {
						some: {
							private: false,
						},
				  },
		},
	});
	return articles;
};
