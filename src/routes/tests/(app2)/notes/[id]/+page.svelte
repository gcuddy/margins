<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import toast from 'svelte-french-toast';
	import Editor from '../Editor.svelte';
	import MarkdownIt from 'markdown-it';

	const md = new MarkdownIt();
	export let data;

	$: editing = $page.url.searchParams.get('edit') === 'true';

	let submitting = false;
</script>

{#if editing}
	<Editor data={data.form} references={data.note.references} />
{:else}
	<!--  -->
	<H1>
		{data.form.data.title ?? 'Untitled'}
	</H1>
	{#if data.form.data.body}
		<div class="prose prose-stone dark:prose-invert">
			{@html md.render(data.form.data.body)}
		</div>
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
