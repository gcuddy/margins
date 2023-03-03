<script lang="ts" context="module">
	export type Input = Entry | Annotation | RouterOutputs["subscriptions"]["loadEntries"][number];

	export type _Input = {
		title: string | null;
		uri: string | null;
		published: Date | null;
		author: string | null;
		unread?: boolean;
	};

	export const BooleanKeys = ["unread"] as const;
	export const BooleanFilter = z.object({
		value: z.boolean(),
		key: z.enum(BooleanKeys).array(),
	});

	export const StringKeys = ["html", "text", "author"] as const;
	export const StringFilter = z.object({
		value: z.string(),
		modifier: z.enum(["contains", "does not contain"]),
		key: z.array(z.enum(StringKeys)),
	});

	export const DateModifiers = ["after", "before"] as const;
	export const DateKeys = ["published"] as const;
	export const DateFilter = z.object({
		value: z.date(),
		modifier: z.enum(DateModifiers),
		key: z.enum(DateKeys).array(),
	});

	export const GenericEqualityFilter = z.object({
		value: z.string(),
		key: z.string(),
	});

	export const Filter = z.union([BooleanFilter, StringFilter, DateFilter, GenericEqualityFilter]);

	interface BaseFilterOption {
		name: string;
		id: string;
		icon?: IconName;
		display?: string;
	}

	interface BaseChildFilterOption extends BaseFilterOption {
		// key: (keyof Entry | 'unread')[];
		perform?: () => void;
		check?: (_items: Input[]) => boolean;
	}

	export type ChildFilterOption = BaseChildFilterOption & z.infer<typeof Filter>;

	interface ParentFilterOption extends BaseFilterOption {
		options: FilterOption[];
	}

	export type FilterOption = ParentFilterOption | ChildFilterOption;

	// export type OldFilterOption = {
	// 	name: string;
	// 	id: string;
	// 	icon?: IconName;
	// 	display?: string;
	// 	options?: FilterOption[];
	// 	key?: (keyof Entry | 'unread')[];
	// 	perform?: () => void;
	// 	filter?: (item: Input, value: FilterOption['value']) => boolean;
	// 	confirm?: () => void;
	// 	prisma?:
	// 		| {
	// 				type: 'StringFilter';
	// 				field: 'title' | 'author';
	// 		  }
	// 		| {
	// 				type: 'SearchFilter';
	// 				field: 'html';
	// 		  };
	// 	/// Whether or not to show the option, based on the items (passed into .every)
	// 	check?: (_items: Input[]) => boolean;
	// } & Partial<z.infer<typeof Filter>>;

	export function buildFilter(filterOption: ChildFilterOption): (item: Input, value?: string) => boolean {
		if (typeof filterOption.value === "string") {
			// do some stuff
			const contains = filterOption.modifier === "contains";
			const value = filterOption.value;
			const keys = filterOption.key;
			return (item) => {
				return searchObjectKeys(item, value, ...keys);
			};
		} else if (typeof filterOption.value === "boolean") {
			if (filterOption.key) {
				const keys = filterOption.key;
				return (item) =>
					keys.every((key) => {
						if (key in item) {
							return item["unread"] === filterOption.value;
						}
					});
			} else {
				throw Error("Need key for boolean");
			}
		} else if (filterOption.value instanceof Date && "modifier" in filterOption) {
			const date = filterOption.value;
			if (filterOption.modifier === "after") {
				filterOption.key;
			}
			if (filterOption.key) {
				// go through keys to test date
				const keys = filterOption.key;
				return (item) =>
					keys.every((key) => {
						return "key" in item ? item[key as keyof Input] : true;
					});
			}
			return () => true;
		} else {
			return () => false;
		}
	}
</script>

<script lang="ts">
	import type { IconName } from "$lib/icons";
	import { searchObjectKeys } from "$lib/stores/filter";
	import { disableGlobalKeyboardShortcuts } from "$lib/stores/keyboard";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { isEntry } from "$lib/utils";
	import type { PickByValue } from "$lib/utils/type-utils";
	import type { Annotation, Entry, Prisma } from "@prisma/client";
	import dayjs from "dayjs";
	import { onDestroy, onMount } from "svelte";
	import { writable, type Writable } from "svelte/store";
	import { z } from "zod";
	import Button from "../Button.svelte";
	import Dialog from "../Dialog.svelte";
	import GenericCombobox from "../GenericCombobox.svelte";
	import GenericInput from "../GenericInput.svelte";
	import Icon from "../helpers/Icon.svelte";

	export let items: Input[] = [];

	// TODO: convert between client side and server side (prisma) filtering

	export let onSave: ((filter: ChildFilterOption) => void) | undefined = undefined;

	export let filters: Writable<ChildFilterOption[]> = writable([]);

	export let onModal: (filter: ChildFilterOption) => void;

	// TODO: every and some
	/// Read only
	let inputValue = writable("");

	export let options: FilterOption[] = [
		{
			name: "Unread",
			id: "unread",
			icon: "unread",
			check: (items) => items.every(isEntry),
			options: [
				{
					name: "Read",
					id: "read",
					icon: "unread",
					key: ["unread"],
					value: false,
					// filter: (item) => ('unread' in item ? !item.unread : false),
				},
				{
					name: "Unread",
					id: "unread",
					value: true,
					key: ["unread"],
					icon: "unread",
					// filter: (item) => ('unread' in item ? item.unread : false),
				},
			],
		},
		{
			name: "Content",
			id: "text",
			icon: "documentText",
			perform: () => {
				console.log(onModal);
				// dialogProperties.filter && onModal(dialogProperties.filter)
			},
			modifier: "contains",
			value: "",
			key: ["html", "text", "author"],
		},
		{
			name: "Published",
			id: "published",
			icon: "calendarDaysMini",
			options: [
				{
					name: "1 Week Ago",
					id: "1-week",
					value: dayjs().subtract(1, "week").toDate(),
					modifier: "after",
					key: ["published"],
				},
				{
					name: "2 Weeks Ago",
					id: "2-week",
					value: dayjs().subtract(2, "week").toDate(),
					modifier: "after",
					key: ["published"],
				},
				{
					name: "3 Weeks Ago",
					id: "3-week",
					value: dayjs().subtract(3, "week").toDate(),
					modifier: "after",
					key: ["published"],
				},
				{
					name: "1 Month Ago",
					id: "1-month",
					value: dayjs().subtract(1, "month").toDate(),
					modifier: "after",
					key: ["published"],
				},
				{
					name: "2 Months Ago",
					id: "2-month",
					value: dayjs().subtract(2, "month").toDate(),
					modifier: "after",
					key: ["published"],
				},
				{
					name: "3 Months Ago",
					id: "3-month",
					value: dayjs().subtract(3, "month").toDate(),
					modifier: "after",
					key: ["published"],
				},
				{
					name: "6 Months Ago",
					id: "6-month",
					value: dayjs().subtract(6, "month").toDate(),
					modifier: "after",
					key: ["published"],
				},
				{
					name: "Custom",
					id: "custom-date",
					modifier: "after",
					key: ["published"],
					value: dayjs().toDate(),
					perform: () => {
						dialogProperties.filter && onModal(dialogProperties.filter);
					},
				},
			],
			key: ["published"],
		},
		{
			name: "Authors",
			id: "author",
			icon: "userCircle",
			modifier: "contains",
			value: "",
			key: ["html", "text", "author"],
		},
	];

	let values = options;

	// $: values = values.filter((value) => (value.check ? value.check(items) : true));

	export let openDialog = false;
	let dialogProperties: {
		input: string;
		filter: ChildFilterOption | null;
	} = {
		input: "",
		filter: null,
	};

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
	bind:ref
	let:active
	bind:inputValue={$inputValue}
	onSelect={(v) => {
		if ("perform" in v && v.perform) {
			dialogProperties.filter = v;
			v.perform();
			return;
		}
		if ("value" in v) {
			if (filters && $filters) {
				$filters = [...$filters, v];
			} else if (onSave) {
				onSave(v);
			}
		}
		if ("options" in v) {
			values = v.options;
		} else {
			values = options;
		}
		$inputValue = "";
	}}
	onKeydown={(e) => {
		if (e.key === "Escape") {
			if (values != options) {
				values = options;
			}
		}
	}}
>
	<div let:active class="flex h-8 items-center gap-2 px-2 text-sm">
		{#if value.icon}
			<Icon className="h-4 w-4 {active ? 'fill-gray-100' : 'fill-gray-400'}" name={value.icon} />
		{/if}
		<span class="grow {active ? 'text-gray-100' : 'text-gray-400'}">{value.display || value.name}</span>
	</div>
</GenericCombobox>

{#if openDialog}
	<Dialog bind:open={openDialog} class="flex max-w-md flex-col gap-4 p-4">
		<div slot="title">Enter content</div>
		<GenericInput bind:value={dialogProperties.input} />
		<div class="flex justify-end">
			<Button
				size="lg"
				on:click={() => {
					if (dialogProperties.filter) {
						dialogProperties.filter.value = dialogProperties.input;
						if (filters) {
							$filters = [...$filters, dialogProperties.filter];
						} else if (onSave) {
							onSave(dialogProperties.filter);
						}
						dialogProperties.filter = null;
					}
					openDialog = false;
				}}>Save</Button
			>
		</div>
	</Dialog>
{/if}
