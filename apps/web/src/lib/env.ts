import { dev } from '$app/environment';
import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';

export const PARTYKIT_HOST = dev ? '127.0.0.1:1999' : PUBLIC_PARTYKIT_HOST;
export const PROTOCOL = PARTYKIT_HOST.startsWith('127.0.0.1')
	? 'http'
	: 'https';
export const PARTYKIT_URL = `${PROTOCOL}://${PARTYKIT_HOST}`;
