<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import type { Pin } from '$lib/queries/server';
	import { Folder, FolderOpen, MoreHorizontal, FolderEdit, FolderX } from 'lucide-svelte';
	import Pins from './pins.svelte';
	import { slide } from 'svelte/transition';
	import { tick } from 'svelte';
	import { cn } from '$lib/utils';
	import * as DropdownMenu from '$components/ui/dropdown-menu';

	export let pin: Pin;

	export let open = false;

	export let renaming = false;

	export let onBlur: () => void = () => {};

	let inputEl: HTMLInputElement;

	$: if (!pin.children) pin.children = [];

	$: if (renaming) {
		tick().then(() => {
			inputEl.focus();
		});
	}
</script>

<Button
	on:click={(e) => {
		if (e.target === e.currentTarget) {
			open = !open;
		}
	}}
	as="div"
	size="sm"
	variant="ghost"
	class={cn(
		'w-full justify-start font-normal group',
		renaming && 'focus-within:ring-1 ring-ring && hover:bg-inherit'
	)}
>
	{#if open && !renaming}
		<FolderOpen class="mr-2 h-4 w-4 shrink-0" />
	{:else}
		<Folder class="mr-2 h-4 w-4 shrink-0" />
	{/if}
	{#if renaming}
		<input bind:this={inputEl} bind:value={pin.folderName} type="text" on:blur={onBlur} />
	{:else}
		{pin.folderName}
	{/if}
	<DropdownMenu.Root
		positioning={{
			placement: 'right-start'
		}}
	>
		<DropdownMenu.Trigger class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity group/trigger">
			<MoreHorizontal class="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-75 group-hover/trigger:opacity-100" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Item>
					<DropdownMenu.Icon icon={FolderEdit} />
					Rename folder</DropdownMenu.Item
				>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Item>
					<DropdownMenu.Icon icon={FolderX} />
					Remove folder</DropdownMenu.Item
				>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Button>
{#if open && !renaming}
	<!-- TODO: have to explicitly set children to empty array here because of type issues -->
	<!-- Hello stuff here -->
	<div transition:slide={{ duration: 200 }}>
		{#if pin.children?.length}
			<Pins on:update class="ml-4 min-h-[20px]" bind:pins={pin.children} parentId={pin.id} />
		{:else}
			<span
				class="text-muted-foreground min-h-[20px] text-xs px-2 mx-auto flex items-center justify-center"
				>No items</span
			>
		{/if}
	</div>
{/if}
