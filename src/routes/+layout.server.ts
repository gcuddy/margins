import { handleServerSession } from '@lucia-auth/sveltekit';

import { S3_BUCKET_PREFIX } from '$env/static/private';

import type { LayoutServerLoad } from './$types.js';

import type { Config } from '@sveltejs/adapter-vercel';


export const config: Config = {
    runtime: "edge",
    // runtime: "nodejs18.x"
}
export const load: LayoutServerLoad = handleServerSession(async (e) => {
    return {
        S3_BUCKET_PREFIX
    }
});
