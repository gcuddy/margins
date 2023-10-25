<script lang="ts">
	import H1 from '$components/ui/typography/H1.svelte';
	import Lead from '$components/ui/typography/Lead.svelte';

	export let data;
	$: content = data.content;
	$: metadata = data.metadata;
</script>

<svelte:head>
	<title>{metadata?.title ? `${metadata.title} - ` : ''}Margins Docs</title>
</svelte:head>

<div class="flex flex-col gap-1">
	{#if metadata?.title}
		<H1>{metadata.title}</H1>
	{/if}
	{#if metadata?.description}
		<Lead>{metadata.description}</Lead>
	{/if}
</div>

<div class="prose prose-slate prose-sm dark:prose-invert">
	<svelte:component this={content} />
</div>
