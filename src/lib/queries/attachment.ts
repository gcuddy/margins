import { db } from '$lib/db';
import type { GetCtx } from '$lib/db/types';
import { nanoid } from '$lib/nanoid';
import type { attachmentCreateInput } from '$lib/schemas/inputs/attachment.schema';
/**
 * Creates a new attachment, or updates one if the same URL/BookmarkId already exists.
 */
export async function attachmentCreate({
	input,
	ctx,
}: GetCtx<typeof attachmentCreateInput>) {
	const { userId } = ctx;
	const { url, title, bookmarkId } = input;
	const id = input.id ?? nanoid();
	await db
		.insertInto('Attachment')
		.values({
			id,
			url,
			title,
			bookmarkId,
			userId,
			updatedAt: new Date(),
		})
		.onDuplicateKeyUpdate({
			title,
		})
		.execute();

	return { id };
}
