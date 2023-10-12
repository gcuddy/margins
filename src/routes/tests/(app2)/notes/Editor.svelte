<script lang="ts">
	import type { Validation } from 'sveltekit-superforms';
	import type { NoteSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { z } from 'zod';
	import { toast } from 'svelte-sonner';
	import { PlusCircleIcon } from 'lucide-svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import type { EntryInList } from '$lib/db/selects';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import { Badge } from '$components/ui/badge'
	import Small from '$lib/components/ui/typography/Small.svelte';

	export let data: Validation<NoteSchema>;

	const { form, enhance, submitting } = superForm(data, {
		onResult: ({ result }) => {
			if (result.type === 'error') {
				toast.error('Error saving note! Please try again.');
			} else {
				toast.success('Note saved!');
			}
		},
		onUpdated: (data) => {
			console.log(data);
		}
	});

	export function update(updateCb: Parameters<(typeof form)['update']>[0]) {
		// form.update((form) => ({ ...form, ...data }));
		form.update(updateCb);
	}

	const commander = getCommanderContext();

	export let references: EntryInList[] = [];

	function add_reference() {
		// TODO: alternatively, a popover for bigger screens
		commander.open({
			shouldFilter: false,
			placeholder: 'Search for a reference',
			component: JumpToEntry,
			props: {
				onSelect(entry) {
					references = [...references, entry];
					$form.references = [...$form.references, entry.id];
					commander.close();
				}
			}
		});
	}
</script>

<form use:enhance action="/tests/notes/new" method="post" class="max-w-prose flex-1 space-y-4">
	<input type="hidden" name="type" value={$form.type ?? 'document'} />
	{#if $form.id}
		<input type="hidden" name="id" value={$form.id} />
	{/if}
	{#if $form.userId}
		<input type="hidden" name="userId" value={$form.userId} />
	{/if}
	<Textarea
		bind:value={$form.title}
		name="title"
		rows={1}
		class="h-auto resize-none border-none text-xl font-semibold"
		placeholder="Untitled"
	/>

	{#if $form.references.length}
		<Small>References</Small>
		<Cluster class="gap-2">
			{#each references as reference}
				<Badge as="li" class="w-min max-w-xs truncate">
					<input type="hidden" name="references" value={reference.id} />
					{reference.title}
				</Badge>
			{/each}
			<Button size="sm" on:click={add_reference} type="button" variant="outline">
				<PlusCircleIcon class="h-4 w-4" />
				<span class="sr-only">Add reference</span>
			</Button>
		</Cluster>
	{:else}
		<Button size="sm" on:click={add_reference} type="button" variant="outline">
			<PlusCircleIcon class="mr-2 h-4 w-4" />
			Add reference
		</Button>
	{/if}
	<Textarea name="body" bind:value={$form.body} class="h-full" />
	<Button disabled={$submitting}>Save</Button>
</form>
