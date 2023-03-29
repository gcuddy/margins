
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    const { locals, depends } = event;
    const theme = event.cookies.get("theme");
    return {
        theme
    }
};
