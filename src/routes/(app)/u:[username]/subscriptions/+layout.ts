import { trpc } from "$lib/trpc/client"
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async (event) => {
    console.log('subscriptions/layout.ts')
    let { subscriptions } = await event.parent()
    console.log({ subscriptions })
    if (!subscriptions) {
        event.depends("app:subscriptions")
        subscriptions = await trpc(event).subscriptions.list.query();
    }
    return {
        ...event.data,
        subscriptions
    }
}