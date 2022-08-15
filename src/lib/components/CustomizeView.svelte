<script lang="ts">
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
		PopoverOverlay,
		Switch,
		SwitchLabel,
		SwitchGroup
	} from '@rgossiaux/svelte-headlessui';
	import { createPopperActions } from 'svelte-popperjs';
	import { fade, fly } from 'svelte/transition';
	import MiniSelect from './atoms/MiniSelect.svelte';
	import MiniSwitch from './atoms/MiniSwitch.svelte';
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
		sort: 'title',
		properties: {
			author: true,
			site: true,
			description: true,
			tags: true,
			annotationCount: true,
			date: false,
			wordCount: false
		}
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
				class=" w-72 rounded-lg bg-gray-50 p-4  shadow-2xl ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/5"
			>
				<div class="flex flex-col space-y-3">
					<div class="flex items-center justify-between">
						<label for="">
							<SmallPlus class="text-gray-500 dark:text-gray-400" size="sm">Sorting</SmallPlus>
						</label>
						<MiniSelect bind:value={viewOptions.sort}>
							<option value="title">Title</option>
							<option value="author">Author</option>
							<option value="date">Publish Date</option>
							<option value="createdAt">Added</option>
						</MiniSelect>
					</div>
					<div class="flex flex-col space-y-2">
						<SmallPlus class="text-gray-500 dark:text-gray-400" size="sm"
							>Display Properties</SmallPlus
						>
						<div class="flex flex-col space-y-2">
							<MiniSwitch
								class="flex justify-between text-sm text-gray-500"
								bind:enabled={viewOptions.properties.author}
								label="Author"
							/>
							<MiniSwitch
								class="flex justify-between text-sm text-gray-500"
								bind:enabled={viewOptions.properties.site}
								label="Site"
							/>
							<MiniSwitch
								class="flex justify-between text-sm text-gray-500"
								bind:enabled={viewOptions.properties.description}
								label="Description"
							/>
							<MiniSwitch
								class="flex justify-between text-sm text-gray-500"
								bind:enabled={viewOptions.properties.tags}
								label="Tags"
							/>
							<MiniSwitch
								class="flex justify-between text-sm text-gray-500"
								bind:enabled={viewOptions.properties.annotationCount}
								label="Annotations"
							/>
							<MiniSwitch
								class="flex justify-between text-sm text-gray-500"
								bind:enabled={viewOptions.properties.date}
								label="Date"
							/>
							<MiniSwitch
								class="flex justify-between text-sm text-gray-500"
								bind:enabled={viewOptions.properties.wordCount}
								label="Word Count"
							/>
						</div>
					</div>
				</div>
			</PopoverPanel>
		</div>
	{/if}
</Popover>
