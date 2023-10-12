<script lang="ts">
	import Header from '$components/ui/Header.svelte';
	import { Layers2Icon, PlusIcon } from 'lucide-svelte';
	import { Button } from '../button';

	import { ctx } from './ctx';
	import FilterBadge from './filter-badge.svelte';

	import { page } from '$app/stores';
	import * as AlertDialog from '$components/ui/alert-dialog';
	import { Input } from '../input';
	import FilterButton from './filter-button.svelte';
	import { flip } from 'svelte/animate';

	const {
		elements: { container },
		state: { dialogStore, hasFilters, filters },
	} = ctx.get();

	export let alwaysShow = false;
	export let showSaveView = true;

	export let saveViewUrl: string | undefined = undefined;
</script>

<!--

 -->

{#if $hasFilters || alwaysShow}
	<Header class="top-[--nav-height]">
		<div class="flex gap-x-2 items-center" bind:this={$container}>
			<slot name="start" />
			{#each $filters as [type, filter]}
				<FilterBadge {type} {filter} />
			{/each}
			<slot>
				{#if $hasFilters}
					<FilterButton variant="ghost" size="icon" class="h-6 w-6 p-0">
						<PlusIcon class="w-4 h-4" />
						<span class="sr-only">Add filter</span>
					</FilterButton>
				{:else if alwaysShow}
					<!-- TODO: reuse componenet? -->
					<FilterButton></FilterButton>
				{/if}
			</slot>
		</div>
		<svelte:fragment slot="end">
			<slot name="end">
				{#if showSaveView && $hasFilters}
					<Button
						href={saveViewUrl ||
							`/tests/views/explore/library${$page.url.search}`}
						size="sm"
						variant="outline"
						class="text-xs"
					>
						<Layers2Icon class="w-4 h-4 mr-1" />
						Save view
					</Button>
				{/if}
			</slot>
		</svelte:fragment>
	</Header>
{/if}
<!--
<AlertDialog.Root bind:open={$dialogStore.open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$dialogStore.title}</AlertDialog.Title>
		</AlertDialog.Header>
		<form class="contents" on:submit|preventDefault>
            heelloooo
			<Input bind:value={$dialogStore.value} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action
					type="submit"
					on:click={() => {
						dialogStore.action();
					}}>Continue</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root> -->
