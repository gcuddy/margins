import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

import type { Config } from '@sveltejs/adapter-vercel';


export const load: LayoutServerLoad = async (event) => {
    const session = await event.locals.validate();
    if (!session) {
        throw redirect(300, "/");
    }
    return {
        ...(await event.parent()),
    };
    // return { user }
};
