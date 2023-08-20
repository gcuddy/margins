import { page } from '$app/stores';
import type { QueryOutput } from '$lib/queries/query';
import { getTargetSelector } from '$lib/utils/annotations';
import type { Annotation } from '@prisma/client';
import { nanoid } from 'nanoid/non-secure';
import { get } from 'svelte/store';

export type EntryAnnotation = NonNullable<NonNullable<QueryOutput<"entry_by_id">["entry"]>["annotations"]>[number]

export function makeAnnotation(annotation: Partial<EntryAnnotation>): EntryAnnotation {
    const $page = get(page)
	return {
		id: nanoid(),
        exact: getExactFromTarget(annotation.target),
        start: getPositionFromTarget(annotation.target),
        type: annotation.type || "annotation",
        username: annotation.username || $page.data?.user_data?.username || "",
        createdAt: new Date(),
        title: annotation.title || null,
        body: annotation.body || null,
        entryId: annotation.entryId || null,
        target: annotation.target || null,
        parentId: annotation.parentId || null,
        contentData: annotation.contentData || null,
		...annotation
	};
}

function getExactFromTarget(target: unknown) {
    if (!target) return null;
    const quote = getTargetSelector(target, "TextQuoteSelector");
    if (quote) {
        return quote.exact;
    }
    return null;
}

function getPositionFromTarget(target: unknown) {
    if (!target) return null;
    const quote = getTargetSelector(target, "TextPositionSelector");
    if (quote) {
        return quote.start;
    }
    return null;
}
