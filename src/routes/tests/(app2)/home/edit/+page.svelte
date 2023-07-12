<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import Button from '$lib/components/ui/Button.svelte';
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';
	import { fly } from 'svelte/transition';

	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator,
		CommandShortcut
	} from '$lib/components/ui/command';
	import Collections from '$lib/commands/Collections.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let id = 0;

	const flipDurationMs = 150;

	export let data: PageData;

	function handleDndConsider(e) {
		data.user.home_items = e.detail.items;
	}
	function handleDndFinalize(e) {
		data.user.home_items = e.detail.items;
	}

	let pages: string[] = [];
	let search = '';
	$: page = pages[pages.length - 1];
</script>

<h1>edit home</h1>

<!-- Page similar to Carrot  -->
<!-- Used  -->
<form method="post" use:enhance>
	<ul
		class="space-y-4"
		use:dndzone={{
			items: data.user.home_items ?? [],
			flipDurationMs
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each data.user.home_items ?? [] as item (item)}
			<li
				class="flex w-full items-center justify-between border p-4"
				animate:flip={{
					duration: flipDurationMs
				}}
			>
				<input type="hidden" name="id" value={item} />
				<span> {item}</span>
				<Button
					variant="secondary"
					size="sm"
					on:click={() => (data.user.home_items = data.user.home_items.filter((i) => i !== item))}
				>
					Remove
				</Button>
			</li>
		{/each}
	</ul>
	<Button>Submit</Button>
</form>

<Dialog
	on:close={() => {
		pages = [];
	}}
>
	<svelte:fragment slot="trigger">
		<Button variant="secondary">Add section</Button>
	</svelte:fragment>
	<DialogContent let:close>
		{#key page}
			{#if !page}
				<div transition:fly class="flex flex-col space-y-4">
					<button on:click={() => (pages = [...pages, 'collection'])}>Collection</button>
					<button on:click={() => (pages = [...pages, 'view'])}>View</button>
				</div>
			{/if}
			{#if page === 'collection'}
				<Command
					onKeydown={(e) => {
						if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
							e.preventDefault();
							pages = pages.slice(0, -1);
						}
					}}
				>
					<CommandInput bind:value={search} placeholder="Search for collection..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<Collections
							onSelect={({ name, id }) => {
								data.user.home_items = [...data.user.home_items, `collection:${id}`];
								close();
							}}
						/>
					</CommandList>
				</Command>
			{/if}
		{/key}
	</DialogContent>
</Dialog>
