import { getContext } from "svelte";

import type { trpcWithQuery } from "$lib/trpc/client";

export const UpdateBookmarkMutationKey = 'UpdateBookmarkMutation';

export function useUpdateBookmark() {
    const mutation = getContext(UpdateBookmarkMutationKey);
    if (!mutation) {
        throw new Error('No UpdateBookmarkMutation context found');
    }
    return mutation as ReturnType<ReturnType<typeof trpcWithQuery>["bookmarks"]["update"]["createMutation"]>;
}
