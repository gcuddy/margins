import { initTRPC } from '@trpc/server';

import type { Context } from '$lib/trpc/context';

export const t = initTRPC.context<Context>().create();
