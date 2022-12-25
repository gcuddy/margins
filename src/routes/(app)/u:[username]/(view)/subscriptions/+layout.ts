import { trpc } from "$lib/trpc/client"
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async (event) => {
    console.log('subscriptions/layout.ts')
    const subscriptions = await trpc(event).subscriptions.list.query();
    console.log({ subscriptions })
    return {
        ...event.data,
        subscriptions
    }
}