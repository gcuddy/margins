export const getArticleUrl = (username: string, id: number, slug: string) =>
	`/u:${username}/article/${id}/${slug}`;
