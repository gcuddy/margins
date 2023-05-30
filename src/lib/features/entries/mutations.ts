import { getContext } from "svelte";

import type { trpc } from "$lib/trpc/client";
import type { CreateMutationOptions } from "@tanstack/svelte-query";
import type { RouterOutputs } from "$lib/trpc/router";

export const UpdateBookmarkMutationKey = 'UpdateBookmarkMutation';

export function useUpdateBookmark() {
    const mutation = getContext(UpdateBookmarkMutationKey);
    if (!mutation) {
        throw new Error('No UpdateBookmarkMutation context found');
    }
    return mutation as ReturnType<ReturnType<typeof trpc>["bookmarks"]["update"]["createMutation"]>;
}

export const CreateBookmarkMutationKey = 'CreateBookmarkMutation';

export function useCreateBookmark() {
    const mutation = getContext(CreateBookmarkMutationKey);
    if (!mutation) {
        throw new Error('No CreateBookmarkMutation context found');
    }
    return mutation as ReturnType<ReturnType<typeof trpc>["bookmarks"]["create"]["createMutation"]>;
}

// const createBookmarkMutation = () => ({
//     onSuccess: () => {
//         /
//     }
// }) satisfies CreateMutationOptions<RouterOutputs["bookmarks"]["create"]>
