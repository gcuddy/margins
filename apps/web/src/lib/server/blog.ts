export type Post = {
	date: string;
	description: string;
	published: boolean;
	slug: string;
	title: string;
};

export async function getPosts() {
	const posts: Post[] = [];

	const paths = import.meta.glob('/blog/*.md', {
		eager: true,
	});

	console.log({ paths });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			if (!metadata.date && /\/blog\/\d{4}-\d{2}-\d{2}-(.*)\.md/.test(path)) {
				const date = path.match(/\/blog\/(\d{4}-\d{2}-\d{2})-(.*)\.md/)?.[1];
				if (date) {
					metadata.date = date;
				}
			}
			const post = { ...metadata, slug } satisfies Post;
			posts.push(post);
			// post.published && posts.push(post)
		}
	}

	// posts = posts.sort((first, second) =>
	// new Date(second.date).getTime() - new Date(first.date).getTime()
	// )

	return posts;
}