import { filterQuery } from "./+page.svelte";
import type { PageLoad } from "./$types";

export const load = (async (e) => {
	const { data } = e;
	// REVIEW: should we also fetch the list here instead?
	const query = filterQuery(data.list.filter, e);
	const { queryClient } = await e.parent();

	console.log({ query });

	// REVIEW: problem doing this because of the transformer here?
	// const initialData =
	// 	(await queryClient.getQueryData(query.queryKey)) ?? (await queryClient.fetchQuery(query));
	// console.log({ initialData });
	const initialData = await queryClient.ensureQueryData(query);
	// const a =
	// duplicated from /fetch.json... not sure how to do this?
	// const articles = await db.article.findMany({
	// 	where: z.any().parse(list.filter),
	// 	select: ArticleListSelect,
	// });
	return {
		...data,
		initialData,
		// initialData: Promise.resolve(initialData),
		// initialData: queryClient.ensureQueryData(query)
	};
}) satisfies PageLoad;
