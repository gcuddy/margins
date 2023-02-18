import type { Location } from "@prisma/client";

import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async (event) => {
    const { params } = event;
    // const { session, user } = await locals.validateUser();
    // console.log({ session, user })
    // if (!session) {
    //     throw redirect(302, `/u:${event.params.username}`);
    // }
    const location = params.location.toLowerCase() as Location | "all";
    return {
        // user,
        location,
    };
};
