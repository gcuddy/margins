<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownBox from '$components/MarkdownBox.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button.svelte';
	import Label from '../Label.svelte';
	import type { TargetSchema } from '$lib/annotation';
	import Input from '../Input.svelte';
	import { notes } from '$lib/state/annotations';

	export let parent_id: string | undefined = undefined;
	export let entry_id: number | undefined = undefined;
	export let id: string | undefined = undefined;
	export let prompt = '';
	export let response = '';
	export let target_schema: TargetSchema | undefined = undefined;
	export let active = false;
	export let editable = true;

	let form: HTMLFormElement;
	$: console.log({ editable, $$props });

	let pending = false;

	const dispatch = createEventDispatcher<{
		save: { id: string };
	}>();

	export let showButton = true;

	export const submit = () => form.requestSubmit();

	// $: state = id ? $notes['id'] : { body: prompt, response };

    $: if (id) {
        notes.update_item(id, { body: prompt, response })
    }

	// todo: use id to fetch most recent prompt and response
</script>

<!-- TODO: accept target selector for full annottation -->

<form
	class="contents"
	method="post"
	action="/tests/srs?/new"
	bind:this={form}
	on:blur={() => {
		console.log(`Form blur`);
	}}
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
	{#if target_schema}
		<input type="hidden" name="target" value={JSON.stringify(target_schema)} />
	{/if}
	{#if parent_id}
		<input type="hidden" name="parent_id" value={parent_id} />
	{/if}
	{#if entry_id}
		<input type="hidden" name="entry_id" value={entry_id} />
	{/if}
	{#if id}
		<input type="hidden" name="id" value={id} />
	{/if}
	<!-- <Label for="prompt">Prompt</Label> -->
	<MarkdownBox
		bind:value={prompt}
		id="prompt"
		name="body"
		autocomplete="off"
		placeholder="Enter prompt here"
		as="textarea"
		rows={1}
		{active}
		on:blur={(e) => console.log({ e })}
		on:keydown={(e) => console.log({ e })}
		class="font-medium"
		{editable}
	/>
	<!-- <Label for="response">Response</Label> -->
	<MarkdownBox
		id="response"
		name="response"
		placeholder="Enter response here"
		as="textarea"
		rows={1}
		bind:value={response}
		on:keydown
		on:blur={(e) => console.log({ e })}
		{editable}
	/>
	<noscript>
		<Input name="entry_id" value={entry_id} placeholder="Entry ID" />
	</noscript>
	{#if showButton}
		<Button disabled={pending} type="submit">Save</Button>
	{/if}
</form>
