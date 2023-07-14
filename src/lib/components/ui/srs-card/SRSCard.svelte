<script lang='ts'>
	import MarkdownBox from "$components/MarkdownBox.svelte";

    export let as = 'div';
</script>


<svelte:element this={as} {...$$restProps} class="border-accent border-2 px-4 pb-4 my-4 rounded-sm flex flex-col max-w-prose">
<MarkdownBox placeholder="Enter prompt here" />
<MarkdownBox placeholder="Enter response here" as="textarea" rows={1} />
</svelte:element>