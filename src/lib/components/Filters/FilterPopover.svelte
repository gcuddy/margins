<script lang="ts">
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
		PopoverOverlay,
	} from '@rgossiaux/svelte-headlessui';
	import { createPopperActions } from 'svelte-popperjs';
	import { fade, fly, scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom-end',
		strategy: 'absolute',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 8],
				},
			},
		],
	});
	import Filters, { type ChildFilterOption, type FilterOption, type Input } from './Index.svelte';
	import Icon from '../helpers/Icon.svelte';
	import Button from '../Button.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { fadeScale } from '$lib/transitions';
	import AskForInput from './AskForInput.svelte';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';

	export let items: Input[] = [];

	// TODO: convert between client side and server side (prisma) filtering

	export let onSave: ((filter: ChildFilterOption) => void) | undefined = undefined;

	export let filters: Writable<ChildFilterOption[]> = writable([]);

	let modal = false;
	let pending_filter: ChildFilterOption;
	let buttonRef: HTMLDivElement;
</script>

<svelte:window
	on:keydown={(e) => {
		if ($disableGlobalKeyboardShortcuts) return;
		if (
			document.activeElement instanceof HTMLInputElement ||
			document.activeElement instanceof HTMLTextAreaElement
		)
			return;
		if (e.key === 'f') {
			e.preventDefault();
			console.log('hell');
			console.log({ buttonRef });
			buttonRef?.querySelector('button')?.click();
		}
	}}
/>

<Popover class="relative" let:open>
	<PopoverButton as="div" use={[popperRef]}>
		<div bind:this={buttonRef}>
			<slot
				><Button
					variant="dashed"
					className="space-x-1 text-sm"
					tooltip={{
						text: 'Filter',
						kbd: 'f',
					}}
				>
					<Icon name="plusSmSolid" className="h-4 w-4 dark:fill-gray-300" /> <span>Filter</span>
				</Button></slot
			>
		</div>
	</PopoverButton>
	<PopoverOverlay />

	{#if open}
		<!-- todo: make this fly instead -->
		<div transition:fade|global={{ duration: 75 }} use:popperContent class="z-20">
			<PopoverPanel static>
				<Filters
					bind:openDialog={modal}
					bind:filters
					{onSave}
					{items}
					onModal={(filter) => {
						pending_filter = filter;
						modal = true;
					}}
				/>
			</PopoverPanel>
		</div>
	{/if}
</Popover>

{#if modal}
	<AskForInput
		bind:open={modal}
		type="string"
		onSave={(value) => {
			$filters = [...$filters, { ...pending_filter, value }];
		}}
	/>
{/if}
