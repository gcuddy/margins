import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { darkThemes } from "$lib/features/settings/themes";
import { auth } from "$lib/server/lucia";

const handleTheme = (async ({ event, resolve }) => {
	let theme: string | null = null;

	const newTheme = event.url.searchParams.get("theme");
	const cookieTheme = event.cookies.get("theme")
	// TODO: when a theme is selected, add light/dark class depending on theme
	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}
	if (theme) {
		return await resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace(
					`data-theme=""`,
					theme && theme !== 'system' ? `data-theme="${theme}"` : ''
				).replace(
					`class=""`,
					`class="${theme && darkThemes.includes(theme) ? "dark" : ""}"`
				)
			},
		})
	}
	return await resolve(event)
}) satisfies Handle

export const handle: Handle = sequence(
	async ({ event, resolve }) => {
		event.locals.auth = auth.handleRequest(event);
		return await resolve(event);
	},
	handleTheme
);
