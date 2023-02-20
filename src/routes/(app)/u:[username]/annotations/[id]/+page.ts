import { error } from '@sveltejs/kit';

import { annotationDetailQuery } from '$lib/features/annotations/queries';

import type { PageLoad } from './$types';

export const load = (async (e) => {
    const { queryClient } = await e.parent();
    const a = await queryClient.ensureQueryData(annotationDetailQuery(e.params.id, e));
    if (!a) {
        throw error(404, 'Annotation not found')
    }
    return {
        annotation: a
    };
}) satisfies PageLoad;
