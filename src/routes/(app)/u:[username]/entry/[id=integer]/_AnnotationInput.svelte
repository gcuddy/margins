<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { enhance } from '$lib/actions/form';
	import type { Annotation } from '@prisma/client';
	import { post } from '$lib/utils';
	import Button from '$lib/components/Button.svelte';

	export let top: number = 0;
	export let visibility: 'visible' | 'hidden' = 'hidden';
	export let text = '';
	export let articleID: number;
	export let highlightId: string = undefined;
	export let editing = true;

	const dispatch = createEventDispatcher();
	const cancel = () => dispatch('cancel');
	const save = async () => {
		const data: Partial<Annotation> = {
			// lol fix this
			articleId: articleID,
			text
		};
		if (highlightId) data.highlightId = highlightId;
		dispatch('save', data);
	};
	let textarea: HTMLTextAreaElement;
	onMount(() => {
		textarea && textarea.focus();
	});
</script>

<!-- this doesn't need to be progressively enhanced with a form, since it would only appear with js... right? -->
<!-- TODO: use Quill or something with rich text? -->
<!-- TODO: Support markdown -->

<!-- tried using this as a form but it was really not working.., -->
{#if editing}
	<div class="text-black" style="top: {top}px; visibility: {visibility};">
		<textarea name="text" bind:value={text} on:focus bind:this={textarea} />
		<section>
			<Button on:click={save}>Save</Button>
			<Button on:click={cancel}>Cancel</Button>
		</section>
	</div>
{/if}

<style lang="postcss">
	div {
		position: absolute;
	}
</style>
