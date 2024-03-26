import type { Message } from '$lib/types/forms';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export function handleLoginRedirect(event: Pick<RequestEvent, 'url'>) {
	const redirectTo = event.url.pathname + event.url.search;
	return `/login?redirectTo=${redirectTo}`;
}

export const loginMessage: Message = {
	status: 'info',
	text: 'You must be logged in to view this page',
};

/**
 * Returns a redirect to the login page with a message. To use, throw this function from a server route.
 * @param event RequestEvent
 */
export function loginRedirect(event: RequestEvent) {
	const redirectTo = event.url.pathname + event.url.search;
	const url = `/login?redirectTo=${redirectTo}`;
	return redirect(302, url, loginMessage, event);
}
