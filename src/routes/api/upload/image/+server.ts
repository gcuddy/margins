
import { error, json } from '@sveltejs/kit';

import { uploadFile } from '$lib/backend/s3.server';
import { nanoid } from '$lib/nanoid';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return new Response();
};


export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.validate();
    if (!session) {
        throw error(401, {
            message: "Not logged in",
        })
    }
    console.log("image upload request");
    const data = await request.formData();
    const img = data.get("image") as Blob;
    const ext = img.type.split("/")[1];
    const id = nanoid();
    const Key = `images/${session.userId}/${id}.${ext}`

    const buf = Buffer.from(await img.arrayBuffer());

    console.log({ img })
    try {
        const file = await uploadFile({
            Body: buf,
            Key,
        })
        console.log({file})
        return json({
           Key
        })
    } catch (e) {
        console.error(e);
        throw error(500)
    }
}
