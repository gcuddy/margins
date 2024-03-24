import { Redis } from '@upstash/redis';
import { Client } from '$lib/qstash/client/client';

import { UPSTASH_QSTASH_TOKEN, UPSTASH_REDIS_TOKEN } from '$env/static/private';

export const redis = new Redis({
	url: 'https://us1-careful-gobbler-37650.upstash.io',
	token: UPSTASH_REDIS_TOKEN,
});
export const qstash = new Client({
	token: UPSTASH_QSTASH_TOKEN,
});
