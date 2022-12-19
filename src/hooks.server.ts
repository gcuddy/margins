import { handleHooks } from '@lucia-auth/sveltekit';

import { auth } from '$lib/server/lucia';

export const handle = handleHooks(auth);
