import { Actions, fail, redirect } from "@sveltejs/kit";

const themes = ["light", "dark"]

export const actions: Actions = {
    // This action is called when the user clicks the theme button
    setTheme: async ({ url, cookies }) => {
        const theme = url.searchParams.get("theme");
        const redirectTo = url.searchParams.get("redirectTo");

        if (!theme || !themes.includes(theme)) {
            return fail(400)
        }

        if (theme) {
            cookies.set("theme", theme, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365,
            })
        }

        throw redirect(303, redirectTo ?? "/");
    }
};