<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownBox from '$components/MarkdownBox.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button.svelte';
	import Label from '../Label.svelte';

	export let parent_id: string | undefined = undefined;
	export let entry_id: number | undefined = undefined;
	export let id: string | undefined = undefined;
	export let prompt = '';
	export let response = '';

	let pending = false;

	const dispatch = createEventDispatcher<{
		save: { id: string };
	}>();

	// todo: use id to fetch most recent prompt and response
</script>

<form
	class="contents"
	method="post"
	action="/tests/playground/srs?/new"
	use:enhance={() => {
		pending = true;
		return async ({ update, result }) => {
			if (result.type === 'success') {
				// TODO: sync state
				if (result.data && typeof result.data.id === 'string') {
					id = result.data.id;
					dispatch('save', { id });
				}
			}
			await update();
			pending = false;
			close();
		};
	}}
>
	{#if parent_id}
		<input type="hidden" name="parent_id" value={parent_id} />
	{/if}
	{#if entry_id}
		<input type="hidden" name="entry_id" value={entry_id} />
	{/if}
	{#if id}
		<input type="hidden" name="id" value={id} />
	{/if}
	<Label for="prompt">Prompt</Label>
	<MarkdownBox bind:value={prompt} id="prompt" name="body" placeholder="Enter prompt here" />
	<Label for="response">Response</Label>
	<MarkdownBox
		id="response"
		name="response"
		placeholder="Enter response here"
		as="textarea"
		rows={1}
		bind:value={response}
	/>
	<Button disabled={pending} type="submit">Save</Button>
</form>
