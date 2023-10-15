<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Collections from '$lib/commands/Collections.svelte';
	import GenericCommander, { commanderStore } from '$lib/commands/GenericCommander.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem
	} from '$lib/components/ui/dropdown-menu';
	import { popoverVariants } from '$lib/components/ui/popover';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { mutation } from '$lib/queries/query.js';
	import { cn } from '$lib/utils/tailwind.js';
	import { ListPlus, MoreHorizontal, PlusCircle, TrashIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { fly } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const commander = commanderStore();

	const { form, enhance, tainted } = superForm(data.bulkForm, {
		dataType: 'json'
	});
</script>

<div class="flex items-center justify-between">
	<div>
	<H1>Evergreens</H1>
	<Lead>
		Evergreen notes are where you build the building blocks of your knowledge.
	</Lead>
</div>
	<div class="flex gap-x-2">
		<DropdownMenu>
			<DropdownMenuTrigger
				class={buttonVariants({
					variant: 'ghost'
				})}
			>
				<MoreHorizontal />
				<span class="sr-only" />
			</DropdownMenuTrigger>
			<DropdownMenuContent class="w-56">
				<DropdownMenuItem on:click={() => goto('/notes/deleted')}>
					<TrashIcon class="mr-2 h-4 w-4" />
					<span>Show deleted</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
		<form action="/notes/new">
			<Button>
				<PlusCircle class="mr-2 h-4 w-4" />
				New Note
			</Button>
		</form>
	</div>
</div>

<!-- <div>
	<div class={tabList}>
		{#each ['Notes', 'Archive'] as tab}
			<a class={tabTrigger()}>{tab}</a>
		{/each}
	</div>
</div> -->
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
		<div class="flex flex-col gap-4">
			<Muted>{$form.ids.length} notes</Muted>
			<div class="flex items-center gap-2">
				<Button
					on:click={() => {
						commander.open({
							component: Collections,
							placeholder: 'Add to collection',
							onSelect: async (collection) => {
								await mutation($page, 'addToCollection', {
									collectionId: collection.id,
									annotationId: $form.ids
								});
								$form.ids = [];
								tainted.set({ ids: [] });
								commander.close();
								toast.success('Added to collection');
							}
						});
					}}
				>
					<ListPlus class="mr-2 h-4 w-4" />
					Add to collection</Button
				>
				<form action="?/delete" method="post" use:enhance>
					<Button variant="destructive">
						<TrashIcon class="mr-2 h-4 w-4" />
						Delete</Button
					>
				</form>
			</div>
		</div>
	</div>
{/if}

{#if $commander.open && $commander.component}
	<GenericCommander bind:isOpen={$commander.open} placeholder={$commander.placeholder}>
		<!--  -->
		<svelte:component this={$commander.component} onSelect={$commander.onSelect} />
	</GenericCommander>
{/if}
