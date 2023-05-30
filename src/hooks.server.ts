import { handleHooks } from "@lucia-auth/sveltekit";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { darkThemes } from "$lib/features/settings/themes";
import { auth } from "$lib/server/lucia";
import { createTRPCHandle } from "trpc-sveltekit";
import { createContext } from "$lib/trpc/context";
import { appRouter } from "$lib/trpc/router";

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
	handleHooks(auth),
	// createTRPCHandle({
	// 	router: appRouter,
	// 	createContext,
	// 	responseMeta({ type, errors, paths }) {
	// 		// see discussion https://github.com/icflorescu/trpc-sveltekit/issues/2
	// 		// this example taken from trcrp website
	// 		// assuming you have all your public routes with the keyword `public` in them
	// 		const allPublic = paths && paths.every((path) => path.split(".").some((p) => p.startsWith("public")));
	// 		// checking that no procedures errored
	// 		const allOk = errors.length === 0;
	// 		// checking we're doing a query request
	// 		const isQuery = type === "query";
	// 		const WILL_CACHE = allPublic && allOk && isQuery;
	// 		if (WILL_CACHE) {
	// 			console.log({ WILL_CACHE });
	// 			// cache request for 1 day + revalidate once every 60 seconds
	// 			const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
	// 			return {
	// 				headers: {
	// 					"cache-control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
	// 				},
	// 			};
	// 		} else if (allOk && isQuery) {
	// 			// is this a good idea?
	// 			return {
	// 				//No!
	// 				// headers: {
	// 				// 	"cache-control": `max-age=0, s-maxage=86400`,
	// 				// },
	// 			};
	// 			// // cache certain things
	// 			// if (paths?.every((path) => path.includes("listForUserSubscriptions"))) {
	// 			// 	console.log(`caching list for user subscriptions`);
	// 			// 	// cache for 5 minutes, revalidate every second
	// 			// 	// REVIEW: this won't work if something new is added, right?
	// 			// 	return {
	// 			// 		headers: {
	// 			// 			"cache-control": `s-maxage=1, stale-while-revalidate=${60 * 5}`,
	// 			// 		},
	// 			// 	};
	// 			// }
	// 			// should we still cache here just no stale-while revalidate?
	// 			// return {
	// 			// 	headers: {
	// 			// 		'cache-control': `s-maxage=1, stale-while-revalidate`,
	// 			// 	}
	// 			// }
	// 		}
	// 		return {};
	// 	},
	// }),
	handleTheme
);
