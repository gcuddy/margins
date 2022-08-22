import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageLoad } from './$types';

const schema = z
	.object({
		id: z.number().int(),
		title: z.string()
	})
	.array();

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/articles?fields=id,title', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw error(400, 'error fetching articles');
	}
	const { articles } = await res.json();
	return {
		articles: schema.parse(articles)
	};
};
