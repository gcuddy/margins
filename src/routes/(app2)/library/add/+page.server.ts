import { S3_BUCKET_PREFIX } from '$env/static/private';
import { upload_file_from_form } from '$lib/backend/utils';
import { db } from '$lib/db';
import { getFirstBookmarkSort } from '$lib/db/selects';
import type { Config } from '@sveltejs/adapter-vercel';
import { fail } from '@sveltejs/kit';
// import pdfjs from "pdfjs-dist/legacy/build/pdf"
// import { make_thumbnail, parse_pdf } from '$lib/utils/pdf';
import { loginRedirect } from '$lib/utils/redirects';
import { nanoid } from 'nanoid';
import type { Actions } from './$types';

export async function load(e) {
	const session = await e.locals.session;
	if (!session) throw loginRedirect(e);

	return {
		session,
	};
}

export const config: Config = {
	runtime: 'nodejs18.x',
};

export const actions: Actions = {
	thumbnail: async (event) => {
		const data = await event.request.formData();
		const file = data.get('file') as Blob;
		const buf = await file.arrayBuffer();
		// const pdf = await pdfjs.getDocument({
		//     data: buf
		// }).promise;
		// console.log({ pdf })
		// const thumb = await make_thumbnail(pdf);
		// await uploadFile({
		//     Body: thumb,
		//     Key: `thumbnails/${file.name}.png`,
		//     ContentType: "image/png"
		// })
		return {
			message: 'ok',
			url: `${S3_BUCKET_PREFIX}thumbnails/${file.name}.png`,
		};
	},
	add_file: async (event) => {
		const session = event.locals.session;
		if (!session) {
			return fail(401, {
				message: 'Not logged in',
			});
		}
		try {
			const { Key, fileName, file } = await upload_file_from_form(
				{
					...event,
					session,
				},
				{
					ContentType: 'application/pdf',
				},
			);

			const buf = await file.arrayBuffer();
			// const pdf = await pdfjs.getDocument({
			//     data: buf
			// }).promise;
			// const thumb = await make_thumbnail(pdf);
			const thumb_key = `user/${
				session.user.userId
			}/thumbnails/thumb_${nanoid()}.png`;
			// await uploadFile({
			//     Body: thumb,
			//     Key: thumb_key,
			//     ContentType: "image/png"
			// })

			// const { title, author } = await parse_pdf(pdf);

			const entry = await db
				.insertInto('Entry')
				.values({
					updatedAt: new Date(),
					uri: Key,
					// title: title || fileName,
					// author,
					type: 'pdf',
					image: '/' + thumb_key,
					// text: todo
				})
				.executeTakeFirstOrThrow();
			const id = Number(entry.insertId);

			// now create bookmark...
			const sort_order = await getFirstBookmarkSort(session.user.userId);
			await db
				.insertInto('Bookmark')
				.values({
					updatedAt: new Date(),
					userId: session.user.userId,
					entryId: id,
					sort_order,
					status: 'Backlog',
				})
				.execute();

			return {
				Key,
			};
		} catch (e) {
			console.error(e);
			return fail(500);
		}
	},
};
