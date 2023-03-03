import { error } from '@sveltejs/kit';

import { db } from '$lib/db';
import { annotationArgs } from '$lib/prisma/selects/annotations';
import { entriesThatBelongToUser, entryListSelect } from '$lib/prisma/selects/entry';
import { basicSubscriptionSelect } from '$lib/prisma/selects/subscription';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
	const { user, session } = await locals.validateUser();
	const { tag } = params;
	const raw = tag.split('/');
	const tags = [
		raw[0],
		...raw.slice(1).map((t) => {
			console.log(t);
			if (!t.startsWith('t:')) {
				throw error(404, 'Invalid tag');
			}
			return t.replace(/^t:/, '');
		}),
	];
	if (!tags) {
		throw error(404, 'Not found');
	}
	const AUTHORIZED = user?.username === params.username;
	const items = await db.entry.findMany({
		where: {
			AND: tags.map((tag) => {
				return {
					tags: {
						some: {
							name: tag,

						},
					},
				};
			}),
            ...entriesThatBelongToUser(user?.userId || "")
			// private: AUTHORIZED ? true : undefined,
		},
		select: {
			...entryListSelect(user?.userId || "")
		},
	});

    const subscriptions = db.subscription.findMany({
		where: {
			AND: tags.map((tag) => {
				return {
					tags: {
						some: {
							name: tag,
						},
					},
				};
			}),
		},
		select: basicSubscriptionSelect,
	});
    const annotations = db.annotation.findMany({
        where: {
			AND: tags.map((tag) => {
				return {
					tags: {
						some: {
							name: tag,
						},
					},
				};
			}),
            userId: user?.userId || ""
		},
        ...annotationArgs
    })
	return {
		tag: tags,
		items,
        lazy: {
            subscriptions,
            annotations
        }
	};
};
