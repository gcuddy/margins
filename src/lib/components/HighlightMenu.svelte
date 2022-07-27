<script lang="ts">
	import Button from './Button.svelte';
	import Form from './Form.svelte';
	/**
	 * noHighlight - disable highlight button (for when js disabled)
	 */
	export let noHighlight = false;

	export let articleId: number;
</script>

<!-- <div class="fixed bottom-4 z-50 flex w-screen justify-center"> -->
<div class="fixed bottom-4 left-0 right-0 mx-auto flex justify-center space-x-4">
	{#if !noHighlight}
		<Form action=""><Button className="shadow-lg">Highlight</Button></Form>
	{/if}
	<Form action="/{articleId}/annotations/new"
		><Button type="submit" className="shadow-lg">Annotate</Button></Form
	>
</div>
<!-- </div> -->
