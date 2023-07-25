<script lang="ts">
	import PdfViewer from '$components/pdf-viewer/PDFViewer.svelte';

	export let url = '';

	let render = false;
</script>

{#if !render}
	<input type="text" bind:value={url} />
	<button on:click={() => (render = true)}>go</button>
{:else}
	<PdfViewer {url} />
{/if}
