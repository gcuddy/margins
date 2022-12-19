import { AnnotationType } from '@prisma/client';
import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { Actions } from './$types';

export const actions: Actions = {
	save: async ({ params, locals, request }) => {
		try {
			const { user } = await locals.validateUser();
			if (!user) {
				throw error(401, 'Not authorized');
			}
			// stateid
			const data = await request.formData();
			const stateId = (data.get('stateId') as string | undefined) || user.default_state_id;
            const id = data.get('id')
            if (id) {
                // SOFT DELETE
                await db.annotation.update({
                    where: {
                        id: +id
                    },
                    data: {
                        deleted: new Date()
                    }
                })
            } else {

                //toggle - check if exists first
                const annotation = await db.annotation.create({
                    data: {
                        entryId: Number(params.id),
                        type: AnnotationType.bookmark,
                        userId: user.userId,
                        stateId: Number(stateId),
                    },
                });
                return {annotation}
            }
		} catch (e) {
			console.error(e);
			throw error(400, 'error saving');
		}
	},
};
