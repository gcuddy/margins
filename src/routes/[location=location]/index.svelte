<script lang="ts">
	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption,
		ListboxLabel
	} from '@rgossiaux/svelte-headlessui';
	import CustomizeView from '$lib/components/CustomizeView.svelte';
	import Filter from '$lib/components/Filter.svelte';

	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';

	import Saved from '$lib/components/Saved.svelte';
	import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
	import {
		LOCATIONS,
		LOCATION_TO_DISPLAY,
		LOCATION_TO_ICON_OUTLINE,
		LOCATION_TO_ICON_SOLID,
		type Location
	} from '$lib/types/schemas/Locations';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { goto } from '$app/navigation';

	export let articles: ArticleWithNotesAndTagsAndContext[] = [];
	export let location: Location;

	// let currentLocation = LOCATION_TO_DISPLAY[location];

	const people = [
		{ id: 1, name: 'Durward Reynolds', unavailable: false },
		{ id: 2, name: 'Kenton Towne', unavailable: false },
		{ id: 3, name: 'Therese Wunsch', unavailable: false },
		{ id: 4, name: 'Benedict Kessler', unavailable: true },
		{ id: 5, name: 'Katelyn Rohan', unavailable: false }
	];

	let selectedPerson = people[0];
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<Listbox
				value={location}
				on:change={(e) => {
					location = e.detail;
					goto(`/${location.toLowerCase()}`);
				}}
			>
				<ListboxLabel class="sr-only">Current location:</ListboxLabel>
				<ListboxButton
					class="relative cursor-default rounded p-1 text-left transition-colors focus-visible:border-indigo-500 focus-visible:bg-gray-700 focus-visible:ring-2  focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 dark:hover:bg-gray-700"
					><SmallPlus>{LOCATION_TO_DISPLAY[location]}</SmallPlus></ListboxButton
				>
				<ListboxOptions
					class="absolute z-20 mt-1 flex min-w-min flex-col overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 text-sm shadow-2xl ring-1 ring-black ring-opacity-10 will-change-transform focus:outline-none dark:text-gray-50 dark:shadow-stone-900"
				>
					{#each LOCATIONS as location (location)}
						<ListboxOption
							class={({ active }) =>
								`flex cursor-default items-center space-x-3 pl-3 pr-5 py-1.5 ${
									active && 'bg-gray-700'
								}`}
							value={location}
							let:active
						>
							<Icon
								name={LOCATION_TO_ICON_SOLID[location]}
								className="h-4 w-4 fill-gray-500 {active && 'fill-gray-100'}"
							/>
							<span>{LOCATION_TO_DISPLAY[location]}</span>
						</ListboxOption>
					{/each}
				</ListboxOptions>
			</Listbox>

			<!-- <select name="" id="">
				<option>Inbox</option>
				<option>Up Next</option>
				<option>Later</option>
				<option>Archive</option>
			</select> -->
		</div>
		<div slot="end" class="flex">
			<Filter />
			<CustomizeView />
		</div>
	</DefaultHeader>
</Header>

<Saved {articles} />
