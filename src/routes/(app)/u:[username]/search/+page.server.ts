import { createCaller } from "$lib/trpc/router";

import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async (event) => {
	const { url } = event;
	const q = url.searchParams.get("q");
	console.log({ q });
	if (!q) {
		return {
			results: [],
			annotations: [],
			tab: 0,
		};
	}
	const tab = url.searchParams.get("t");
	// TODO: matches
	const caller = await createCaller(event);
	// const results =

	const [results, annotations] = await Promise.all([caller.entries.search({query: q}), caller.annotations.search(q)]);
	// console.time('searchMatching');
	// const matches = results.map((result) => {
	// 	const regex = new RegExp(q, 'gi');
	// 	const title = result.title.replace(
	// 		regex,
	// 		'<mark class="bg-primary-100 dark:bg-primary-500/30 dark:text-white">$&</mark>'
	// 	);
	// 	const contentMatches = result.textContent.search(regex);
	// 	let content = '';
	// 	if (contentMatches > 0) {
	// 		// todo: make much more sophisticated
	// 		content = result.textContent.substring(contentMatches - 50, contentMatches + 50).trim();
	// 		// now highlight the matched content
	// 		content = content.replace(
	// 			new RegExp(q, 'gi'),
	// 			'<mark class="bg-primary-100 dark:bg-primary-500/50 dark:text-white">$&</mark>'
	// 		);
	// 	}
	// 	return {
	// 		title,
	// 		content,
	// 	};
	// });
	// console.timeEnd('searchMatching');
	return {
		results,
		annotations: annotations || [],
		q,
		tab: tab ? +tab : 0,
		// matches,
	};
};
