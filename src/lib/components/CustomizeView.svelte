<script lang="ts">
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
		PopoverOverlay,
		Transition
	} from '@rgossiaux/svelte-headlessui';
	import { createPopperActions } from 'svelte-popperjs';
	import { fade, fly } from 'svelte/transition';
	import MiniSelect from './atoms/MiniSelect.svelte';
	import Select from './atoms/Select.svelte';
	import SmallPlus from './atoms/SmallPlus.svelte';
	import Button from './Button.svelte';
	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom-end',
		strategy: 'fixed',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 8]
				}
			}
		]
	});

	// Example Popper configuration
	// const popperOptions = {
	// 	placement: 'bottom-end',
	// 	strategy: 'fixed'
	// };
	import Icon from './helpers/Icon.svelte';

	export let viewOptions = {
		sort: 'title'
	};
</script>

<Popover class="relative" let:open>
	<PopoverButton as="div" use={[popperRef]}>
		<Button variant="ghost" className="space-x-1">
			<Icon name="adjustmentsSolid" className="h-4 w-4 dark:fill-gray-300" /> <span>View</span>
			<Icon name="chevronDownSolid" className="h-4 w-4 dark:fill-gray-300" />
		</Button></PopoverButton
	>
	<PopoverOverlay />

	<!-- TODO: testing out this Transition element, but probably to keep consistent I'll use svelte transitions. Can view how that's done with this library in docs here https://svelte-headlessui.goss.io/docs/popover#using-svelte-transitions -->
	<!-- <Transition
		enter="transition duration-100 ease-out"
		enterFrom="transform scale-95 opacity-0"
		enterTo="transform scale-100 opacity-100"
		leave="transition duration-75 ease-out"
		leaveFrom="transform scale-100 opacity-100"
		leaveTo="transform scale-95 opacity-0"
    >
  </Transition> -->
	{#if open}
		<!-- todo: make this fly instead -->
		<div transition:fade={{ duration: 150 }} use:popperContent class="z-10">
			<PopoverPanel
				static
				class=" w-72 rounded-lg bg-gray-50 p-4 shadow-2xl ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/5"
			>
				<div class="flex flex-col">
					<div class="flex items-center justify-between">
						<label for="">
							<SmallPlus class="dark:text-gray-400" size="sm">Sorting</SmallPlus>
						</label>
						<MiniSelect bind:value={viewOptions.sort}>
							<option value="title">Title</option>
							<option value="author">Author</option>
							<option value="date">Publish Date</option>
							<option value="createdAt">Added</option>
						</MiniSelect>
					</div>
				</div>
			</PopoverPanel>
		</div>
	{/if}
</Popover>
