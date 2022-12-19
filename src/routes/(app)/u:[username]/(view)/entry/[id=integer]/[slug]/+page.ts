import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getArticleUrl } from '../utils';

export const load: PageLoad = ({ params }) => {
	throw redirect(302, `/u:${params.username}/article/${params.id}/`);
};
