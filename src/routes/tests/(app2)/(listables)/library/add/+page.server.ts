import { upload_file_from_form } from '$lib/backend/utils'
import { fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import type { Config } from '@sveltejs/adapter-vercel';
import { getFirstBookmarkSort } from '$lib/db/selects';
import { S3_BUCKET_PREFIX } from '$env/static/private';

export const config: Config = {
    runtime: "nodejs18.x",
}

export const actions = {
    add_file: async (event) => {
        const session = await event.locals.validate();
        if (!session) {
            return fail(401, {
                message: "Not logged in",
            })
        }
        try {
            const { Key, fileName } = await upload_file_from_form({
                ...event,
                session
            }, {
                ContentType: "application/pdf",
            });

            // get metadata
            // const pdf_url = S3_BUCKET_PREFIX + Key;
            // console.log({ pdf_url })
            // const response = await event.fetch(`/api/pdf/metadata/${encodeURIComponent(pdf_url)}`);
            // const metadata = await response.json();
            // return {
            //     metadata
            // }

            const entry = await db.insertInto("Entry")
                .values({
                    updatedAt: new Date(),
                    uri: Key,
                    title: fileName,
                    type: "pdf",
                })
                .executeTakeFirstOrThrow();

            const id = Number(entry.insertId)

            // now create bookmark...
            const sort_order = await getFirstBookmarkSort(session.userId)

            await db.insertInto("Bookmark")
                .values({
                    updatedAt: new Date(),
                    userId: session.userId,
                    entryId: id,
                    sort_order,
                    status: "Backlog"
                })
                .execute();

            return {
                Key
            }
        } catch (e) {
            console.error(e)
            return fail(500);
        }
    }
}