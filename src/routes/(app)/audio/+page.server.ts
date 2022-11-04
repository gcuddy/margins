import type { Actions } from '@sveltejs/kit';
import { parseStream, parseBuffer } from 'music-metadata';
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream';

export const actions: Actions = {
	default: async ({ request }) => {
		console.log('Hello, world!');
		const data = await request.formData();
		const file = data.get('file') as Blob;
		console.log({ file, stream: file.stream, type: typeof file });
		const _stream = file.stream();
		// TODO: despite the warnings, this seems to.... work?
		const stream = new ReadableWebToNodeStream(_stream);
		const metadata = await parseStream(stream, 'audio/mpeg', { duration: true });
		// const metadata = await parseBlob(mp3);
		console.log({ metadata });
		return {
			title: metadata.common.title,
			album: metadata.common.album,
			artist: metadata.common.artist,
		};
	},
};
