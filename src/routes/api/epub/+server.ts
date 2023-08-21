import type { Config } from '@sveltejs/adapter-vercel';
import { error } from '@sveltejs/kit';
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: ''
});

export const config: Config = {
	runtime: 'nodejs18.x'
};

export async function POST({ request }) {
	const file = request.body;
	if (!file) {
		throw error(500, {
			message: 'no body'
		});
	}

	const array_buffer = await request.arrayBuffer();
	// const book = ePub(array_buffer);

	const zip = new JSZip();
	const x = await zip.loadAsync(array_buffer);

	const containerSchema = z.object({
		container: z.object({
			rootfiles: z.object({
				rootfile: z.object({
					'full-path': z.string(),
					'media-type': z.string()
				})
			})
		})
	});

	const textContents = [];

	const container_file = zip.file('META-INF/container.xml');

	const container_xml = await container_file?.async('string');

	if (!container_xml) {
		throw error(500, 'Missing container.xml');
	}

	console.log({ container_xml });
	const container = containerSchema.parse(parser.parse(container_xml));

    const rootFilePath = container.container.rootfiles.rootfile['full-path'];

    console.log({rootFilePath})

    const rootFile = zip.file(rootFilePath);

    const rootFileXml = await rootFile?.async('string');

    console.log({rootFileXml})

    if (!rootFileXml) {
        throw error(500, 'Missing root file');
    }

    const rootFileParsed = parser.parse(rootFileXml);

    console.dir({rootFileParsed}, {depth: null})



	console.dir({ container }, { depth: null });

	// Iterate through the contents of the ePub archive
	// zip.forEach(async (relativePath, zipEntry) => {
	// 	console.dir({ relativePath, zipEntry }, { depth: null });
	// 	const textContent = await zipEntry.async('string');
	// 	console.log({ relativePath, textContent });
	// 	if (relativePath.endsWith('.xml') || relativePath.endsWith('.html')) {
	// 		textContents.push(textContent);
	// 	}
	// });

	// const allText = textContents.join('\n\n');

	// console.log({ allText });

	// book.archive

	// console.dir({book}, {depth: null})
	// console.log('here')

	return new Response();
}
