import type { Post } from '$lib/server/blog';
import { error } from '@sveltejs/kit';
import type { ComponentType } from 'svelte';

export const load = async ({ params }) => {
	try {
		const post = await import(`../../../../../blog/${params.slug}.md`);

		return {
			content: post.default as ComponentType,
			meta: post.metadata as Post,
		};
	} catch {
		error(404, `Could not find ${params.slug}`);
	}
};
