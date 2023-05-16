
import { error, json } from '@sveltejs/kit';

import { uploadFile } from '$lib/backend/s3.server';
import { nanoid } from '$lib/nanoid';

import type { RequestHandler } from './$types';


export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.validate();
    if (!session) {
        throw error(401, {
            message: "Not logged in",
        })
    }
    console.log("file upload request");
    const data = await request.formData();
    const file = data.get("file") as Blob;
    const ext = file.type.split("/")[1];
    const id = nanoid();
    const Key = `assets/${session.userId}/${id}.${ext}`
    const buf = Buffer.from(await file.arrayBuffer());
    try {
        const file = await uploadFile({
            Body: buf,
            Key,
        })
        console.log({ file })
        return json({
            Key
        })
    } catch (e) {
        console.error(e);
        throw error(500)
    }
}