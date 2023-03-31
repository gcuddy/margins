import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { upsertImageUrl } from '$lib/backend/s3.server';
import { db } from "$lib/db"
import type { Config } from '@sveltejs/adapter-vercel';
const schema = z.object({
    urls: z.array(z.object({
        url: z.string().url(),
        key: z.string()
    })),
    id: z.number().optional(),
})
export const config: Config = {
    runtime: "nodejs18.x"
}
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        throw error(400, 'Invalid request body');
    }
    const { urls, id } = parsed.data;
    return json({
        urls,
        id
    })
    // const keys = await Promise.all(urls.map(async ({ url, key }) => {
    //     const newKey = await upsertImageUrl(url, key);
    //     return {
    //         url,
    //         oldKey: key,
    //         newKey
    //     }
    // }));
    // const keysToUpdate = keys.filter(({ oldKey, newKey }) => oldKey !== newKey);
    // console.log({ keysToUpdate })
    // return json(keys)
    if (!keysToUpdate.length) {
        return json(keys);
    }
    // then take our new paths and update the database at entry id data.id by doing a replace on the html column
    const entry = await db.selectFrom("Entry")
        .select(["html"])
        .where("id", "=", id)
        .executeTakeFirst();
    if (!entry) {
        throw error(404, 'Entry not found');
    }
    const { html } = entry;
    if (!html) {
        throw error(404, 'Entry has no html');
    }
    const newHtml = keysToUpdate.reduce((html, { oldKey, newKey }) => {
        return html.replace(oldKey, newKey);
    }, html);
    await db.updateTable("Entry")
        .set({ html: newHtml })
        .where("id", "=", id)
        .execute();
    console.log({ keysToUpdate })
    return json(keys);
}
