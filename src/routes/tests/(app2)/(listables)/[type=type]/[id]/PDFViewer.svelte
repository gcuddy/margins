<script lang="ts">
	import { page } from '$app/stores';
	import PdfViewer from '$components/pdf-viewer/PDFViewer.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	const pdf_path = data.entry?.uri?.startsWith('http')
		? data.entry?.uri
		: $page.data.S3_BUCKET_PREFIX + data.entry?.uri;
</script>

<div class="h-screen relative">
	<PdfViewer
		style="
    position: absolute;
    width: 100%;
    height: 100%;
"
		url={pdf_path}
	/>
	<!-- {pdf_path} -->
</div>

<style>
	div :global(mark) {
		color: transparent !important;
	}
</style>
