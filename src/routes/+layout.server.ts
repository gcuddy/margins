import { handleServerSession } from '@lucia-auth/sveltekit';

import { S3_BUCKET_PREFIX } from '$env/static/private';

import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = handleServerSession((e) => {
   return {
        S3_BUCKET_PREFIX
   }
});
