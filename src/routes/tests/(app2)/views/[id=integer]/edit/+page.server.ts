import { View } from "../../new/View";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, params, parent }) => {
    const data = await parent();
    return {
        // conditions: data.view
    }
}) satisfies PageServerLoad;