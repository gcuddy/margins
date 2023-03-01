import { json } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from "$lib/db"
import { createCaller } from '$lib/trpc/router';

import type { RequestHandler } from './$types';

const schema = z.object({
    url: z.string(),
    html: z.string().optional()
})
export const POST: RequestHandler = async (evt) => {
    const authKey = evt.params.authKey;
    const user = await db.user.findFirst({
        where: {
            AuthorizationKey: {
                id: authKey
            }
        }
    });
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    try {
        const caller = await createCaller(evt);
        const data = await evt.request.json();
        const { url, html } = schema.parse(data);
        console.log({ html, url })
        const article = await caller.public.parse({
            url,
            html
        });
        console.log({ article })
        const entry = await db.entry.upsert({
            where: {
                uri: url
            },
            // ...
        });
        // const bookmark = await db.bookmark.upsert({
        //     where: {
        //         uri_entryId_userId: {
        //             uri: url,
        //             entryId: entry?.id ?? -1,
        //             userId: user.id
        //         }
        //     },
        //     create: {
        //         uri: url,
        //         entry: {
        //             connectOrCreate: {

        //             }
        //         },
        //         // userId: user.id,

        //     }
        // })

        return json(entry)
        // const bookmark = await caller.bookmarks.add({
        //     url,
        //     article
        // })
        // return json(bookmark);
    } catch (e) {
        console.error(e);
        return new Response('Error', { status: 500 });
    }
    // const bookmark = await caller.
};
