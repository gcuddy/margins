import { Prisma } from '@prisma/client';
import { type RequestHandler, error, json } from '@sveltejs/kit';

import { getUserData } from '$lib/user';

const selectionLookup = Prisma.validator<Prisma.UserSelect>()({
	annotations: true,
	// articles: ArticleListSelect,j
	favorites: true,
});

export const GET: RequestHandler = async ({ request, url, locals }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	// TODO: old setup of user store and just grabbing certain fields
	const fields = url.searchParams.get('data')?.split(',');
	try {
		// const session = await locals.validate();
		// TODO: this should work but it doesn't
		const session = await locals.validate();
		// console.log({ session, user });
		if (!session) {
			throw error(401, 'Unauthorized');
		}
		const userData = await getUserData(session.userId);
		return json(userData);
	} catch (e) {
		console.error(e);
		throw error(401, 'unauthorized');
	}
};
