
import { error, json } from '@sveltejs/kit';

import { uploadFile } from '$lib/backend/s3.server';
import { nanoid } from '$lib/nanoid';

import type { RequestHandler } from './$types';
import { S3_BUCKET_PREFIX } from '$lib/constants';

// todo: make run on edge


export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.validate();
    if (!session) {
        throw error(401, {
            message: "Not logged in",
        })
    }
    console.log("file upload request");

    const file = request.body;
    if (!file) {
        throw error(500, {
            message: "No body"
        })
    }

    const file_name = request.headers.get('filename') || nanoid();
    const content_type = request.headers.get("content-type") || "text/plain";
    const file_type = `.${content_type.split("/")[1]}`;

    // todo: unique id

    // construct final filename based on content-type if not provided
    const final_name = file_name.includes(file_type)
        ? file_name
        : `${file_name}${file_type}`;


    const Key = `assets/uploads/${final_name}`


    const blob = await uploadFile({
        Key,
        Body: Buffer.from(await request.arrayBuffer()),
        ContentType: content_type
    })

    console.log({ blob })

    console.log({ url: S3_BUCKET_PREFIX + Key })

    return json({
        url: S3_BUCKET_PREFIX + Key
    });


    // old version via formdata

    // const file = data.get("file") as Blob;
    // const ext = file.type.split("/")[1];
    // const id = nanoid();
    // const Key = `assets/${session.userId}/${id}.${ext}`
    // const buf = Buffer.from(await file.arrayBuffer());
    // try {
    //     const file = await uploadFile({
    //         Body: buf,
    //         Key,
    //     })
    //     console.log({ file })
    //     return json({
    //         Key
    //     })
    // } catch (e) {
    //     console.error(e);
    //     throw error(500)
    // }
}