<script lang="ts">
	import { page } from "$app/stores";
	import AnnotationList from "$lib/components/AnnotationList.svelte";
	import Filter from "$lib/components/Filters/Filter.svelte";
	import type { FilterOption } from "$lib/components/Filters/SimpleFilter.svelte";
	import FiltersList from "$lib/components/Filters/FiltersList.svelte";
	import SearchInput from "$lib/components/Filters/SearchInput.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import { getContext, setContext } from "svelte";
	import { writable, Writable } from "svelte/store";
	import type { PageData } from "./$types";
	import { Color } from "@prisma/client";
	export let data: PageData;
	$: ({ annotations } = data);
	$: console.log({ annotations });

	const disableAnimation = writable(false);
	setContext("disableAnimation", disableAnimation);
	let options: FilterOption<typeof annotations[number]>[];
	$: options = [
		{
			id: "color",
			name: "Color",
			icon: "colorSwatch",
			multiple: true,
			options: Object.values(Color).map((c) => ({
				id: c,
				name: c,
				filter: (n) => n.color === c,
				color: `var(--highlight-${c.toLowerCase()})`,
			})),
		},
		{
			id: "private",
			name: "Private",
			icon: "lockClosedMini",
			options: [
				{
					id: "show-private",
					name: "Private",
					filter: (a) => a.private,
					icon: "lockClosedMini",
				},
				{
					id: "show-public",
					name: "Public",
					filter: (a) => !a.private,
					icon: "lockOpenMini",
				},
			],
		},
	];
</script>

<Filter values={annotations} searchKeys={["body"]} let:searchTerm let:filters let:_filters let:filteredItems>
	<Header>
		<DefaultHeader>
			<div slot="start">Notebook</div>
			<div slot="end">view</div>
		</DefaultHeader>
	</Header>
	<div class="flex flex-col">
		{#if annotations}
			<div>
				<SearchInput value={searchTerm} on:active={({ detail: active }) => disableAnimation?.set(active)} />
			</div>
			{#if _filters.length}
				<div class="p-3">
					<FiltersList {filters} {options} />
				</div>
			{/if}
		{/if}
		<slot />
	</div>
	<AnnotationList annotations={filteredItems} class="grid grid-cols-3 flex-wrap justify-center gap-2 " />
</Filter>
