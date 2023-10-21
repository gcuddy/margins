// import { handleServerSession } from '@lucia-auth/sveltekit';

import { S3_BUCKET_PREFIX } from '$env/static/private';

import type { LayoutServerLoad } from './$types.js';
import { loadFlash } from 'sveltekit-flash-message/server';

import type { Config } from '@sveltejs/adapter-vercel';

export const load: LayoutServerLoad = loadFlash(async (e) => {
	return {
		S3_BUCKET_PREFIX,
	};
});
