import { fail, redirect } from '@sveltejs/kit';

import { allowedThemes } from "$lib/features/settings/themes";
import { createCaller } from '$lib/trpc/router';

import type { Actions } from './$types';

// export const load = (async () => {
//     return {

//     };
// }) satisfies PageServerLoad;


export const actions: Actions = {
    generateColors: async (e) => {
        const color = String((await e.request.formData()).get('color'))
        console.log({color})
        const caller = await createCaller(e);
        const colors = await caller.user.generateColors(color);
        return { colors }
    },
    setTheme: async (e) => {
        const { request, cookies, url} = e;
        const theme = String((await request.formData()).get('theme'));
        console.log({theme})

        if (!allowedThemes.includes(theme as any)) {
            return fail(400, {
                message: `Invalid theme: ${theme}`,
            });
        }
        cookies.set("theme", theme, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        })
        // redirect to theme with query param
        throw redirect(303, `${url.pathname}?theme=${theme}`)
    }
}
