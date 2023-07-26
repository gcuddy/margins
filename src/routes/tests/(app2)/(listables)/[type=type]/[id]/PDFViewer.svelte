<script lang="ts">
	import PdfViewer from '$components/pdf-viewer/PDFViewer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const pdf_path = data.entry?.uri?.startsWith('http')
		? data.entry?.uri
		: data.S3_BUCKET_PREFIX + data.entry?.uri;
</script>

<div class="h-screen relative">
	<PdfViewer
		style="
    position: absolute;
    top: 5rem;
    left: 50%;
    transform: translate(-50%);
    width: 900px;
    height: 800px;
    outline-style: solid;
    outline-width: 1px;
    outline-offset: 0px;
"
		scale={0.8}
		url={pdf_path}
	/>
</div>

<style>
	div :global(mark) {
		color: transparent !important;
	}
</style>
