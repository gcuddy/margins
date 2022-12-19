import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q');
	console.log({ q });
	if (!q) {
		return {
			results: [],
		};
	}
	// db.article.findMany({
	//   where: {
	//     title: {
	//       contains: "d",
	//       mode: 'insensitive'
	//     },
	//     readProgress: {
	//       gt: 1
	//     }
	//   }
	// })
	const results = await db.article.findMany({
		where: {
			textContent: {
				search: q,
			},
			title: {
				search: q,
			},
		},
		include: {
			tags: true,
		},
	});
	console.time('searchMatching');
	const matches = results.map((result) => {
		const regex = new RegExp(q, 'gi');
		const title = result.title.replace(
			regex,
			'<mark class="bg-primary-100 dark:bg-primary-500/30 dark:text-white">$&</mark>'
		);
		const contentMatches = result.textContent.search(regex);
		let content = '';
		if (contentMatches > 0) {
			// todo: make much more sophisticated
			content = result.textContent.substring(contentMatches - 50, contentMatches + 50).trim();
			// now highlight the matched content
			content = content.replace(
				new RegExp(q, 'gi'),
				'<mark class="bg-primary-100 dark:bg-primary-500/50 dark:text-white">$&</mark>'
			);
		}
		return {
			title,
			content,
		};
	});
	console.timeEnd('searchMatching');
	return {
		results,
		matches,
	};
};
