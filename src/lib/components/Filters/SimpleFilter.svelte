<script lang="ts" context="module">
	interface BaseOption {
		name: string;
		id: string;
		icon?: IconName;
		color?: string;
		parent?: string;
		boolean?: boolean;
	}

	export interface ParentOption<T> extends BaseOption {
		options: FilterOption<T>[];
		multiple?: boolean;
	}

	/**
	 * @see https://github.com/prisma/prisma/issues/6980
	 */
	type ModelDels = {
		[Key in Prisma.ModelName]: PrismaClient[Uncapitalize<Key>];
	};

	type Model<T extends Record<string, unknown>, TName extends string> = T & { kind: TName };

	type WhereInput<T> = T extends Model<Record<string, unknown>, Prisma.ModelName>
		? Exclude<Parameters<ModelDels[T["kind"]]["findFirst"]>[0], undefined | null>["where"]
		: never;

	type Post = Model<Entry, "Entry">;

	type PostWhereInput = WhereInput<Post>;

	export interface ChildOption<T, PrismaWhere = never> extends BaseOption {
		perform?: () => void;
		prisma?: PrismaWhere;
		filter: (item: T) => boolean;
		negated?: (item: T) => boolean;
		type?: string;
	}
	export type FilterOption<T, P = never> = ParentOption<T> | ChildOption<T, P>;
</script>

<script lang="ts">
	import type { IconName } from "$lib/icons";
	import { disableGlobalKeyboardShortcuts } from "$lib/stores/keyboard";
	import { onDestroy, onMount } from "svelte";
	import { writable } from "svelte/store";
	import { createEventDispatcher } from "svelte";
	import { match } from "ts-pattern";
	import GenericCombobox from "../GenericCombobox.svelte";
	import Icon from "../helpers/Icon.svelte";
	import * as p from "@prisma/client";
	import type { Entry, Prisma, PrismaClient } from "@prisma/client";

	let inputValue = writable("");

	type T = $$Generic;
	let current_parent: ParentOption<T> | undefined = undefined;
	$: multiple = !!current_parent?.multiple;

	export let options: FilterOption<T>[] = [];
	export let chosenFilters: ChildOption<T>[] = [];
	$: chosenIds = chosenFilters.map((c) => c.id);
	$: console.log({ chosenFilters });
	export let any: "any" | "none" | "all" = "all";

	const dispatch = createEventDispatcher<{
		select: {
			multiple: boolean;
		};
	}>();

	let values = options;
	let ref: HTMLElement;

	onMount(() => {
		if (ref) {
			ref.focus();
		}
		disableGlobalKeyboardShortcuts.on();
	});
	onDestroy(() => disableGlobalKeyboardShortcuts.off());
</script>

<GenericCombobox
	static
	{values}
	let:value
	placeholder="Filter..."
	multiple={current_parent?.multiple}
	bind:ref
	let:active
	on:expanded
	bind:inputValue={$inputValue}
	selectedValue={chosenFilters}
	onSelect={(v) => {
		if ("filter" in v) {
			// then it's a child item
			// toggle
			if (chosenIds.includes(v.id)) {
				chosenFilters = chosenFilters.filter((f) => f.id !== v.id);
			} else {
				chosenFilters = [...chosenFilters, v];
			}
			// get parent
			console.log({ current_parent });
			dispatch("select", { multiple });
		}
		if ("perform" in v && v.perform) {
			v.perform();
			values = options;
			return;
		}
		if (!multiple) {
			if ("options" in v && v.options) {
				values = v.options;
				current_parent = v;
			} else {
				values = options;
			}
		}
		$inputValue = "";
	}}
	onEscape={() => {
		values = options;
	}}
>
	{@const selected = chosenIds.includes(value.id)}
	<div let:active class="flex h-8 items-center gap-2 px-2 text-sm">
		{#if multiple}
			<input type="checkbox" name="" id="" checked={selected} />
		{/if}
		<!-- {#if selected}
			<Icon className="h-4 w-4 {active ? 'fill-gray-700' : 'fill-black/50'}" name="checkMini" />
		{/if} -->
		{#if value.icon}
			<Icon
				className="h-4 w-4 {active ? 'fill-gray-700 dark:fill-gray-200' : 'fill-black/50 dark:fill-white/50'}"
				name={value.icon}
			/>
		{:else if value.color}
			<div style:background={value.color} class="h-4 w-4 rounded-full" />
		{/if}
		<span class="grow {active ? 'dark:text-gray-100' : 'text-gray-700 dark:text-gray-100'}">{value.name}</span
		>
	</div>
</GenericCombobox>
