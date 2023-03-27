
export const load = async (event) => {
    // const caller = await appRouter.createCaller(await createContext(event));
    // const { entries, nextCursor } = await caller.entries.listForUserSubscriptions({
    // 	cursor: +cursor || undefined,
    // });
    const data = await event.parent();
    console.log(`subscriptions/all +page.server.ts:load: data:`, data)
    console.log({ data })
    // const client = trpcWithQuery(event, data.queryClient);
    // const query = client.entries.listForUserSubscriptions.createServerInfiniteQuery();
    // console.log({ query })
    return {
        // entries,
        // nextCursor,
        title: "All items",
    };
};
