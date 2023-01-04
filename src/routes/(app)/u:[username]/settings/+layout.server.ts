import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    const { user } = await event.locals.validateUser();
    if (!user) {
        throw redirect(300, "/")
    }
    return { user }
}