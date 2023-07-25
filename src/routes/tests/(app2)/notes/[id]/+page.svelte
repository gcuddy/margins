<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import { toast } from 'svelte-sonner';
	import Editor from '../Editor.svelte';
	import TipTapEditor from '$components/ui/editor/Editor.svelte';
	import MarkdownIt from 'markdown-it';
	import { render_html } from '$components/ui/editor/utils';
	import Textarea from '$components/ui/Textarea.svelte';
	import { mutation } from '$lib/queries/query';

	const md = new MarkdownIt();
	export let data;

	$: editing = $page.url.searchParams.get('edit') === 'true';

	let submitting = false;

    // function save() {
    //     mutation($page, 'save_note', {

    //     })
    // }
</script>

<!-- TODO: Rich Editor Form, submits to endpoint (optionally on Blur, if no buttons). It renders and displays to markdown if no js. -->

{#if editing}
	<Editor data={data.form} references={data.note.references} />
{:else}
	<!--  -->
	<!-- <H1>
		{data.form.data.title ?? 'Untitled'}
	</H1> -->
	<Textarea
		value={data.form.data.title}
		placeholder="Note title"
		rows={1}
		autocomplete="off"
		class="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl font-serif"
	/>
	{#if data.form.data.body}
		<div class="prose prose-stone dark:prose-invert">
			{@html md.render(data.form.data.body)}
		</div>
	{:else if data.note.contentData}
		<TipTapEditor content={data.note.contentData}>
			<svelte:fragment slot="top">
				{#if data.note.target}
					<p>{data.note.exact}</p>
				{/if}
			</svelte:fragment>
		</TipTapEditor>
		<!-- {JSON.stringify(data.note.contentData)} -->
		<!-- <div class="prose prose-stone dark:prose-invert">
			{@html render_html(data.note.contentData)}
		</div> -->
	{/if}

	{#if data.note.references.length}
		<div class="mt-4">References</div>
		<ul>
			{#each data.note.references as reference}
				<li>
					{reference.title}
				</li>
			{/each}
		</ul>
	{/if}
	<div class="mt-4 flex items-center gap-x-2">
		<Button variant="outline" disabled={submitting} as="a" href="?edit=true">Edit</Button>
		<form
			use:enhance={() => {
				submitting = true;
				return async ({ update, result }) => {
					submitting = false;
					update();
					if (result.type === 'redirect') {
						toast.success('Note deleted');
					} else if (result.type === 'success') {
						toast.success('Note restored');
					}
				};
			}}
			method="post"
		>
			{#if data.note.deleted}
				<Button formaction="?/restore" disabled={submitting}>Restore</Button>
			{:else}
				<Button formaction="?/delete" disabled={submitting} variant="destructive">Delete</Button>
			{/if}
		</form>
	</div>
{/if}
