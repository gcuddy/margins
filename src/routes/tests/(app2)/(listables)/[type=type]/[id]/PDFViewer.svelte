<script lang="ts">
	import { page } from '$app/stores';
	import PdfViewer from '$components/pdf-viewer/PDFViewer.svelte';

	import type { PageData } from './$types';
	import Selection from './Selection.svelte';

	export let data: PageData;

	const pdf_path = data.entry?.uri?.startsWith('http')
		? data.entry.uri
		: ($page.data.S3_BUCKET_PREFIX ?? '') + data.entry?.uri;

	let pdfViewer: PdfViewer;
</script>

<Selection
	on:highlight={() => {
		pdfViewer.highlight();
	}}
/>
<div class="h-screen relative">
	<PdfViewer
		bind:this={pdfViewer}
		style="
    position: absolute;
    width: 100%;
    height: 100%;
"
		url={pdf_path}
	/>
	<!-- {pdf_path} -->
</div>

<style lang="postcss">
	div :global(mark) {
		color: transparent !important;
	}
</style>
