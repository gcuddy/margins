import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ data, params }) => {
	const url = `/u:${params.username}/article/${params.id}/${data.article.slug}`;
	console.log({ url });
	throw redirect(302, `/u:${params.username}/article/${params.id}/${data.article.slug || 't'}`);
};
