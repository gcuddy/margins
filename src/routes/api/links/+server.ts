import { linksSchema } from '$lib/schemas/inputs/links';
import { error } from '@sveltejs/kit';

export async function POST({ request }) {

    try {

        const data = await request.json();

        const parsed = linksSchema.parse(data);

        // for each link, we need to go see if it's a valid link....

    } catch(e) {
        console.error(e);
        throw error(500);
    }


}
