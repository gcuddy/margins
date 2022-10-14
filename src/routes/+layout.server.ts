import { auth } from '$lib/server/lucia';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = auth.handleServerSession();
