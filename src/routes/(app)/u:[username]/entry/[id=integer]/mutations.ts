import { getContext } from "svelte";

import { nanoid } from "$lib/nanoid";
import type { trpcWithQuery } from "$lib/trpc/client";
import type { RouterOutputs } from "$lib/trpc/router";

export const SaveAnnotationMutationKey = "saveAnnotationMutation" as const;

export function useSaveAnnotation() {
    const mutation = getContext(SaveAnnotationMutationKey);
    if (!mutation) {
        throw new Error("No saveAnnotationMutation context found");
    }
    return mutation as ReturnType<ReturnType<typeof trpcWithQuery>["annotations"]["save"]["createMutation"]>;
}

export function createAnnotation(
    data: Partial<RouterOutputs["entries"]["load"]["annotations"][number]>,
    { user, entryId }: {
        user: {
            username: string;
            id: string;
        }, entryId: number
    }
): RouterOutputs["entries"]["load"]["annotations"][number] {
    return {
        id: data.id || nanoid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        editedAt: null,
        deleted: null,
        userId: user.id,
        parentId: null,
        sortOrder: 0,
        bookmarkId: null,
        type: "annotation",
        body: "",
        contentData: null,
        chosenIcon: null,
        title: null,
        private: false,
        target: null,
        entryId,
        color: "Yellow",
        creator: {
            username: user.username || "",
        },
        children: [],
        ...data,
    }
}
