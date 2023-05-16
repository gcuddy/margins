import { error, json } from '@sveltejs/kit';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

export async function GET({ params }) {
    const { url } = params;
    try {
        console.log({ url })
        const loadingTask = getDocument(url);
        const pdfDocument = await loadingTask.promise;
        console.log({ pdfDocument })
        const metadata = await pdfDocument.getMetadata();
        console.log({ metadata })
        return json(metadata);
    } catch (e) {
        console.error("Error reading PDF Metadata", e);
        throw error(500, "Error reading PDF Metadata");
    }

}