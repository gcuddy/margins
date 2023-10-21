<script lang="ts">
	import {
		defaultViewOptions,
		type ViewOptions,
	} from "$lib/types/schemas/View";
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
		PopoverOverlay,
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
	} from "@rgossiaux/svelte-headlessui";
	import isEqual from "lodash.isequal";
	import { createPopperActions } from "svelte-popperjs";
	import { fade, fly } from "svelte/transition";
	import { createEventDispatcher } from "svelte";
	import MiniSelect from "./atoms/MiniSelect.svelte";
	import MiniSwitch from "./atoms/MiniSwitch.svelte";
	import SmallPlus from "./atoms/SmallPlus.svelte";
	import Button from "./Button.svelte";
	const dispatch = createEventDispatcher<{
		save: ViewOptions;
		view: ViewOptions["view"];
	}>();
	const [popperRef, popperContent] = createPopperActions({
		placement: "bottom-end",
		strategy: "fixed",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, 8],
				},
			},
		],
	});

	// Example Popper configuration
	// const popperOptions = {
	// 	placement: 'bottom-end',
	// 	strategy: 'fixed'
	// };
	import Icon from "./helpers/Icon.svelte";
	export let viewOptions: ViewOptions = {
		...defaultViewOptions,
		properties: { ...defaultViewOptions.properties },
	};
	let ogViewOptions = {
		...viewOptions,
		properties: { ...viewOptions.properties },
	};
	let changed = false;
	$: if (!isEqual(viewOptions, ogViewOptions)) {
		changed = true;
	} else {
		changed = false;
	}
</script>

<Popover class="relative" let:open>
	<PopoverButton as="div" use={[popperRef]}>
		<Button
			variant="ghost"
			className="space-x-1 sm:!text-sm !text-xs"
			tooltip={{
				text: "Show view options",
			}}
		>
			<Icon
				name="adjustmentsSolid"
				className="h-3 w-3 sm:h-4 sm:w-4 dark:fill-gray-300"
			/> <span>View</span>
			<Icon
				name="chevronDownSolid"
				className="h-3 w-3 sm:h-4 sm:w-4 dark:fill-gray-300"
			/>
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
		<div
			transition:fade={{ duration: 150 }}
			use:popperContent
			class="z-20"
		>
			<PopoverPanel
				static
				class=" w-72 rounded-lg bg-gray-50 p-4  shadow-2xl ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/5"
			>
				<div class="flex flex-col space-y-3 divide-y">
					<div class="flex items-center justify-between">
						<label class="grow" for="">
							<SmallPlus class="text-gray-500 dark:text-gray-400" size="sm"
								>View</SmallPlus
							>
						</label>
						<MiniSelect
							on:change={() => dispatch("view", viewOptions.view)}
							bind:value={viewOptions.view}
						>
							<option value="list">List</option>
							<option value="grid">Grid</option>
							<option value="kanban">Kanban</option>
						</MiniSelect>
					</div>
					<div class="flex items-center justify-between">
						<label class="grow" for="">
							<SmallPlus class="text-gray-500 dark:text-gray-400" size="sm"
								>Sorting</SmallPlus
							>
						</label>
						<MiniSelect bind:value={viewOptions.sort}>
							<option value="manual">Manual</option>
							<option value="title">Title</option>
							<option value="author">Author</option>
							<option value="date">Publish Date</option>
							<option value="created">Saved</option>
							<option value="due">Due</option>
							<!-- <option value="updatedAt">Updated</option> -->
						</MiniSelect>
					</div>
					<Disclosure class="flex flex-col space-y-2 pt-2" let:open>
						<DisclosureButton
							class="group flex w-full items-center space-x-4 rounded focus-visible:ring-1"
						>
							<SmallPlus
								class="text-gray-500 transition dark:text-gray-400"
								size="sm">Display Properties</SmallPlus
							>
							<Icon
								name="chevronUpSolid"
								className="h-4 w-4 fill-gray-500 transition"
								direction={open ? "s" : "n"}
							/>
						</DisclosureButton>
						<DisclosurePanel>
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
								<MiniSwitch
									class="flex justify-between text-sm text-gray-500"
									bind:enabled={viewOptions.properties.location}
									label="Location"
								/>
							</div>
						</DisclosurePanel>
					</Disclosure>
					{#if changed}
						<div class="flex justify-between">
							<button
								class="rounded-full p-1 text-sm focus-visible:ring-1"
								on:click={() => {
									viewOptions = {
										...ogViewOptions,
										properties: { ...ogViewOptions.properties },
									};
								}}
								><SmallPlus class="text-gray-500">Reset to Default</SmallPlus
								></button
							>
							<button
								class="rounded-full p-1 text-sm font-medium text-sky-500 focus-visible:ring-1"
								on:click={() => {
									ogViewOptions = {
										...viewOptions,
										properties: { ...viewOptions.properties },
									};
									dispatch("save", viewOptions);
								}}
							>
								Save for view
							</button>
						</div>
					{/if}
				</div>
			</PopoverPanel>
		</div>
	{/if}
</Popover>
