<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { popoverVariants } from '$lib/components/ui/popover';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { cn } from '$lib/utils/tailwind.js';
	import { RefreshCw, Trash2Icon } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	export let data;

	const { form, enhance } = superForm(data.bulkForm, {
		dataType: 'json'
		// taintedMessage: null
	});
</script>

<H1>Recently deleted notes</H1>
<Lead>
	These notes have been deleted in the last 30 days. After 30 days, they will be permanently
	deleted.
</Lead>

<div class="mt-4 flex flex-col space-y-3">
	{#each data.notes as note}
		<div class="group flex items-center gap-x-1">
			<input
				type="checkbox"
				bind:group={$form.ids}
				value={note.id}
				class="opacity-0 transition-opacity checked:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
			/>
			<a class="text-xl font-semibold tracking-tighter" href="/notes/{note.id}"
				>{note.title}</a
			>
		</div>
	{/each}
</div>

{#if $form.ids.length}
	<div
		class={cn(popoverVariants(), 'fixed bottom-14 left-0 right-0 mx-auto w-max')}
		transition:fly={{ y: 30 }}
	>
		<form use:enhance method="post" class="flex flex-col gap-4">
			<Muted>{$form.ids.length} notes</Muted>
			<div class="flex items-center gap-2">
				<Button formaction="?/restore">
					<RefreshCw class="mr-2 h-4 w-4" />
					<span>Restore</span>
				</Button>
			</div>
		</form>
	</div>
{/if}
