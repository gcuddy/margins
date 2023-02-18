<script lang="ts" context="module">
	type Value<T> = {
		display?: string;
		where?: T;
		id?: string;
	};
	type Condition<TWhereInput extends {}, TModel extends Record<keyof TWhereInput, any>> = {
		[K in keyof TWhereInput]: {
			title: string;
			field: K;
			id: string;
			type?: NonNullable<TModel[K]> extends string
				? "string" | string[]
				: NonNullable<TModel[K]> extends number
				? "number"
				: // string[] indicates enum
				  "string" | "number" | string[] | undefined;
			// values:
			// 	| NonNullable<Value<TWhereInput[K]>>[]
			// 	| ((
			// 			value: NonNullable<TModel[K]> extends Primitive ? NonNullable<TModel[K]> : any
			// 	  ) => NonNullable<Value<TWhereInput[K]>>[]);
			values: (
				value: NonNullable<TModel[K]> extends Primitive ? NonNullable<TModel[K]> : any,
				userId?: string
			) => Value<TWhereInput[K]>[];
		};
	}[keyof TWhereInput];

	type EntryWhereInput = Omit<Prisma.EntryWhereInput, "AND" | "OR" | "NOT">;

	// REVIEW: Supressing this error for now while I figure out how to fix it (need to fix generic parameter to be smarter)
	// @ts-expect-error
	type ConditionForEntry = NonNullable<Condition<EntryWhereInput, Entry>>;

	type EntryValue = {
		[K in keyof EntryWhereInput]: {
			// TODO: type this better
			value?: string | number;
			filter: Omit<Value<EntryWhereInput[K]>, "display">;
		};
	}[keyof EntryWhereInput];

	export type ChosenEntryCondition = {
		field: keyof EntryWhereInput;
		value?: string | number;
		filter_id: string;
		type?: "string" | "number";
		id: string;
	};
</script>

<script lang="ts">
	import { page } from "$app/stores";
	import MiniSelect from "$lib/components/atoms/MiniSelect.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { DocumentType, Entry, Prisma } from "@prisma/client";
	import { createEventDispatcher } from "svelte";
	import type { Primitive } from "type-fest";

	const conditions: ConditionForEntry[] = [
		{
			title: "Recipe",
			field: "recipe",
			id: "recipe",
			values: () => [
				{
					display: "Is a recipe",
					id: "recipe",
					where: {
						not: Prisma.AnyNull,
					},
				},
				{
					display: "Is not a recipe",
					id: "no-recipe",
					where: {
						equals: Prisma.AnyNull,
					},
				},
			],
		},
		{
			title: "Author",
			field: "author",
			id: "author",
			type: "string",
			values: (value) => [
				{
					display: "Contains",
					id: "author-contains",
					where: {
						contains: value,
					},
				},
				{
					display: "Is",
					id: "author-is",
					where: {
						is: value,
					},
				},
			],
		},
		{
			title: "Title",
			field: "title",
			id: "title",
			type: "string",
			values: (value) => [
				{
					display: "Contains",
					id: "title-contains",
					where: {
						contains: value,
					},
				},
				{
					display: "Is",
					id: "title-is",
					where: {
						is: value,
					},
				},
			],
		},
		{
			title: "Read Progress",
			field: "interactions",
			id: "read-progress",
			type: "number",
			values: (value: number) => [
				{
					display: "Less Than",
					id: "read-lt",
					where: {
						some: {
							progress: {
								lt: value,
							},
						},
					},
				},
			],
		},
		{
			title: "Type",
			field: "type",
			id: "type",
			values: () =>
				Object.keys(DocumentType).map((t) => ({
					display: t,
					id: `type-${t}`,
					where: {
						equals: t as DocumentType,
					},
				})),
		},
		{
			title: "Location",
			field: "bookmarks",
			id: "location",
			values: () => {
				return ($page.data.user?.states || []).map((state) => {
					return {
						display: state.name,
						id: `state-${state.id}`,
						where: {
							some: {
								stateId: state.id,
							},
						},
					};
				});
			},
		},
		{
			title: "Movie",
			// should allow array (and) for multiple fields e.g. tmdb and original
			field: "original",
			id: "location",
			values: () => {
				return [
					{
						display: "Is a movie",
						// search in json
					},
				];
			},
		},
	];

	const dispatch = createEventDispatcher();

	/** read only pls */
	export let json: Prisma.EntryWhereInput = {};

	$: currentCondition = conditions.find((c) => c.field === condition.field);
	$: currentValues = currentCondition?.values(condition.value, $page.data.user?.id);
	$: currentValue = currentValues?.find((v) => v.id === condition.filter_id);
	$: console.log({ currentValue });
	$: json = {
		[condition.field]: currentValue?.where,
	};
	$: condition.type = conditions.find((c) => c.field === condition.field)?.type;
</script>

<div class="flex items-center space-x-1">
	<MiniSelect
		bind:value={condition.field}
		on:change={() => {
			// set the filter_id to first condition
			condition.filter_id =
				conditions.find((c) => c.field === condition.field)?.values({}, $page.data.user?.id)[0].id ?? "";
		}}
	>
		{#each conditions as c}
			<option value={c.field}>{c.title}</option>
		{/each}
		<!-- <option value="readProgress">Read Progress</option>
		<option value="tags">Tags</option>
		<option value="location">Location</option> -->
	</MiniSelect>
	<MiniSelect name="{condition.field}-filter" bind:value={condition.filter_id}>
		{@const c = conditions.find((c) => c.field === condition.field)}

		{#if c}
			{#each c.values(undefined, $page.data.user?.id) as { id, display } (id)}
				<option value={id}>{display}</option>
			{/each}
			<!-- {#if Array.isArray(c.values)}
				{#each c.values as value (value.id)}
					<option value={value.id}>{value.display}</option>
				{/each}
			{:else}
				{#each c.values(condition.value) as { id, display } (id)}
					<option value={id}>{display}</option>
				{/each}
			{/if} -->
		{/if}
	</MiniSelect>
	{condition.type}
	{#if condition.type === "string"}
		<GenericInput
			variant="filled"
			class="!h-7 flex-auto grow focus:bg-gray-200 dark:focus:bg-gray-700"
			name={condition.field}
			bind:value={condition.value}
		/>
		<!-- bind:value={condition.value} -->
	{:else if condition.type === "number"}
		<!-- else if content here -->
		<GenericInput
			variant="filled"
			type="number"
			placeholder="Enter number"
			min={0}
			max={100}
			class="!h-7 flex-auto grow focus:bg-gray-200 dark:focus:bg-gray-700"
			name={condition.field}
			bind:value={condition.value}
		/>
		<!-- bind:value={condition.value} -->
	{:else}
		<!-- else content here -->
	{/if}

	<!-- {#if condition.field === "location"} -->
	<!-- <LocationListbox
			location={condition.value}
			on:change={(e) => {
				condition.value = e.detail;
			}}
		/> -->
	<!-- {:else if condition.type === "StringFilter" || condition.type === "SearchFilter"}
		<GenericInput
			variant="filled"
			class="!h-7 flex-auto grow focus:bg-gray-200 dark:focus:bg-gray-700"
			name={condition.field}
			bind:value={condition.value}
		/>
	{:else if condition.type === "NumberFilter"}
		<GenericInput
			variant="filled"
			type="number"
			placeholder="Enter number"
			min={0}
			max={100}
			class="!h-7 flex-auto grow focus:bg-gray-200 dark:focus:bg-gray-700"
			name={condition.field}
			bind:value={condition.value}
		/>
		<span>%</span>
	{/if} -->
	<button on:click={() => dispatch("delete")}>
		<Icon name="xSolid" />
		<span class="sr-only">Delete</span>
	</button>
</div>
