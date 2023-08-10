import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { Actions } from './$types';

export const actions: Actions = {
	update: async ({ locals, request, params }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw error(401, 'Not authorized');
		}
		const data = await request.formData();
		const css = (data.get('css') as string) || '';
		const domain = data.get('domain') as string | null;
		const stylesheet = await db.stylesheet.update({
			where: {
				id: Number(params.id),
			},
			data: {
				css,
				domain: domain ? domain : undefined,
			},
		});
		return {
			stylesheet,
		};
	},
};
