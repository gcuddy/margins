import { error, json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { uploadFile } from '$lib/backend/s3.server';
import { nanoid } from '$lib/nanoid';

import type { RequestHandler } from './$types';
import { S3_BUCKET_PREFIX } from '$lib/constants';
import pdfjs from 'pdfjs-dist/legacy/build/pdf';
import type { Config } from '@sveltejs/adapter-vercel';
import { get_pdf_fingerprint, make_thumbnail, parse_pdf } from '$lib/utils/pdf';

// todo: make run on edge

export const config: Config = {
	runtime: 'nodejs18.x'
};

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, {
			message: 'Not logged in'
		});
	}
	console.log('file upload request');

	const file = request.body;
	if (!file) {
		throw error(500, {
			message: 'No body'
		});
	}

	const file_name = request.headers.get('filename') || nanoid();
	const content_type = request.headers.get('content-type') || 'text/plain';
	const file_type = `.${content_type.split('/')[1]}`;

	// todo: unique id

	// construct final filename based on content-type if not provided
	const final_name = file_name.includes(file_type) ? file_name : `${file_name}${file_type}`;

	const Key = `assets/uploads/${final_name}`;

	const array_buffer = await request.arrayBuffer();

	const blob = await uploadFile({
		Key,
		Body: Buffer.from(array_buffer),
		ContentType: content_type
	});

	const final_url = S3_BUCKET_PREFIX + Key;

	let thumbnail_url: string | undefined = undefined;

	const related_entry_id = url.searchParams.get('related_entry_id');
	let title: string | undefined = undefined;
	// TODO: pdf magic
	if (content_type === 'application/pdf' && related_entry_id) {
		// get thumbnail and shit?
		const pdf = await pdfjs.getDocument({
			data: array_buffer
		}).promise;

		const thumbnail = await make_thumbnail(pdf);

		const thumb_key = `/thumbnails/thumb_${nanoid()}.png`;

		thumbnail_url = S3_BUCKET_PREFIX + thumb_key;

		await uploadFile({
			Key: thumb_key,
			Body: thumbnail,
			ContentType: 'image/png'
		});

		// add an entry for this - get the owner id

		const { title: pdf_title, author, text } = await parse_pdf(pdf);

		title = pdf_title;
		const entry = await db
			.insertInto('Entry')
			.values({
				updatedAt: new Date(),
				author,
				title: title || file_name,
				text,
				uri: final_url,
				image: thumbnail_url,
				type: 'pdf',
				owned_by_id: session.user.userId,
				pdf_fingerprint: await get_pdf_fingerprint(pdf)
			})
			.executeTakeFirstOrThrow();

		const pdf_entry_id = Number(entry.insertId);

		// add groupng relation
		await db
			.insertInto('Relation')
			.values({
				relatedEntryId: +related_entry_id,
				entryId: pdf_entry_id,
				type: 'Grouped',
				id: nanoid(),
				updatedAt: new Date(),
				userId: session.user.userId
			})
			.execute();
	}

	return json({
		url: final_url,
		thumbnail_url,
        title
	});

	// old version via formdata

	// const file = data.get("file") as Blob;
	// const ext = file.type.split("/")[1];
	// const id = nanoid();
	// const Key = `assets/${session.user.userId}/${id}.${ext}`
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
};
