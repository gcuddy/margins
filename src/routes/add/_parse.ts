import { Parser } from '$lib/web-parser';
export default async function (url: string, html?: string) {
	let htmlToParse = html;
	if (!htmlToParse) {
		const response = await fetch(url);
		if (response.headers.get('content-type')?.includes('text/html')) {
			htmlToParse = await response.text();
		} else if (response.headers.get('content-type')?.includes('application/pdf')) {
			// download pdf
			const pdfArrayBuffer = await response.arrayBuffer();
			// convert to uint8array
			const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
			const title = url;
			const content = '';
			const author = '';
			const image = '';
			const date = '';
			const wordCount = 0;
			const pdf = true;
			// pdfJsLib
			// 	.getDocument(url)
			// 	.promise.then((pdf) => {
			// 		pdf.getMetadata().then((data) => {
			// 			console.log(JSON.stringify(data.info, null, 2));
			// 			console.log(JSON.stringify(data.metadata?.getAll(), null, 2));
			// 			title = data.metadata.get('title');
			// 		});
			// 	})
			// 	.catch((e) => console.log(e));
			return {
				title,
				content,
				author,
				image,
				date,
				wordCount,
				pdf,
				textContent: ''
			};
			// const blob = await response.blob();
			// const file = new File([blob], 'file.pdf');
		}
	}
	if (htmlToParse) {
		// const parsed = await parseHtml(htmlToParse as string, url);
		// console.log({ parsed });
		const parser = new Parser(url, htmlToParse as string);
		const p = await parser.parse();
		// console.log('parser', { content });
		return p;
	} else {
		return {
			title: '',
			description: '',
			content: '',
			author: '',
			image: '',
			date: '',
			wordCount: 0,
			textContent: ''
		};
	}
}
