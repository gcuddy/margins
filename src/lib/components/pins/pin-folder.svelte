<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import type { Pin } from '$lib/queries/server';
	import { Folder, FolderOpen, MoreHorizontal, FolderEdit, FolderX } from 'lucide-svelte';
	import Pins from './pins.svelte';
	import { slide } from 'svelte/transition';
	import { createEventDispatcher, tick } from 'svelte';
	import { cn } from '$lib/utils';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import type { Size } from '$components/ui/button';

	export let pin: Pin & {
		pending?: boolean;
	};

	export let disableMutations = false;

	export let open = false;

	export let renaming = false;

	export let size: 'sm' | 'default' | 'lg' = 'sm';

	export let onBlur: (updatedPin: typeof pin) => void = () => {};

	let inputEl: HTMLInputElement;

	const dispatch = createEventDispatcher<{
		update: undefined;
		delete: Pin;
	}>();

	let previousName = pin.folderName;
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
	{size}
	variant="ghost"
	class={cn(
		'w-full justify-start font-normal group',
		renaming && 'focus-within:ring-1 ring-ring ring-inset hover:bg-inherit',
		size !== 'sm' && 'text-base'
	)}
>
	{#if open && !renaming}
		<FolderOpen class="mr-2 h-4 w-4 shrink-0" />
	{:else}
		<Folder class="mr-2 h-4 w-4 shrink-0" />
	{/if}
	{#if renaming}
		<input
			bind:this={inputEl}
			bind:value={pin.folderName}
			class="appearance-none w-full focus:outline-none bg-transparent"
			type="text"
			on:blur={(e) => {
				// console.log(pin.folderName, { previousName })
				if (!pin.folderName && previousName) {
					pin.folderName = previousName;
					return;
				}
				renaming = false;
				onBlur(pin);
			}}
		/>
	{:else}
		{pin.folderName}
	{/if}
	<DropdownMenu.Root
		positioning={{
			placement: 'right-start'
		}}
	>
		<DropdownMenu.Trigger
			class="ml-auto group-hover:opacity-100 transition-opacity group/trigger"
		>
			<MoreHorizontal
				class={cn(
					'h-3 w-3 shrink-0 opacity-0 group-hover:opacity-75 group-hover/trigger:opacity-100',
					size !== 'sm' && 'h-4 w-4 opacity-50'
				)}
			/>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Item
					disabled={disableMutations}
					on:m-click={() => {
						renaming = true;
						tick().then(() => {
							setTimeout(() => {
								inputEl.focus();
							}, 100);
							// inputEl.focus()
						});
					}}
				>
					<DropdownMenu.Icon icon={FolderEdit} />
					Rename folder</DropdownMenu.Item
				>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Item
					disabled={disableMutations}
					on:m-click={() => {
						dispatch('delete', pin);
					}}
				>
					<DropdownMenu.Icon icon={FolderX} />
					Remove folder</DropdownMenu.Item
				>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Button>
{#if open}
	<!-- TODO: have to explicitly set children to empty array here because of type issues -->
	<!-- Hello stuff here -->
	<div transition:slide={{ duration: 200 }}>
		{#if pin.children}
			<Pins {size} on:update class="ml-4 min-h-[20px]" bind:pins={pin.children} parentId={pin.id} />
		{:else}
			<span
				class="text-muted-foreground min-h-[20px] text-xs px-2 mx-auto flex items-center justify-center"
				>No items</span
			>
		{/if}
	</div>
{/if}
