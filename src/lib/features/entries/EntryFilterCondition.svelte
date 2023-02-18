<script lang="ts">
	import { page } from "$app/stores";
	import { clickOutside } from "$lib/actions/clickOutside";
	import Button from "$lib/components/Button.svelte";
	import GenericCombobox from "$lib/components/GenericCombobox.svelte";
	import GenericDialog from "$lib/components/GenericDialog.svelte";

	import GenericInput from "$lib/components/GenericInput.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import type { IconName } from "$lib/icons";
	import { createStack } from "$lib/stores/undo";
	import type { Page } from "@sveltejs/kit";
	import { ComponentProps, createEventDispatcher, SvelteComponent } from "svelte";
	import { writable } from "svelte/store";
	import { ChosenCondition, conditions, EntryWhereInput } from "./EntryFilter.svelte";
	import { DatePicker } from 'date-picker-svelte'


	const inputValue = writable("");

	const dispatch = createEventDispatcher<{
		close: null;
		save: ChosenCondition;
	}>();

	let ref: HTMLElement;

	let value: string | number | Date;

	type BasicConditionOrValue = {
		title: string;
		field?: keyof EntryWhereInput;
		id: string;
		icon?: IconName;
		type?: "string" | "number" | "boolean" | "date";
		values?: (value: any, page: Page) => BasicConditionOrValue[] | Promise<BasicConditionOrValue[]>;
		where?: EntryWhereInput[keyof EntryWhereInput];
	};

	const stack = createStack<BasicConditionOrValue[]>(conditions);

	let selectedCondition: BasicConditionOrValue | null = null;

	$: console.log({ selectedCondition });

	let whereInputs: EntryWhereInput[] = [];

	let show_input = false;

	// how to allow for other inputs?

	// this doesn't work - get to work!
	type InputComponents = {
		[key: string]: <T extends SvelteComponent>() => {
			component: T;
			props: ComponentProps<T>;
		};
	};

	let dialogTitle: string | null = null;
	let selectedValueId: string | null = null;
	let inputComponents = {
		string: {
			component: GenericInput,
			props: {
				type: "text",
			},
		},
		number: {
			component: GenericInput,
			props: {
				type: "number",
			},
			value: 0,
		},
		date: {
			component: DatePicker,
			props: {
				// value: new Date(),
				// browseWithoutSelecting: true
			}
		}
	} as const;

	export let chosenCondition: ChosenCondition | null | undefined = null;
</script>

<!-- {JSON.stringify(chosenCondition, null, 2)} -->

<div
	use:clickOutside={() => {
		if (!show_input) dispatch("close");
	}}
>
	<GenericCombobox
		static
		values={$stack.current}
		filter={(value) => value.title.toLowerCase().includes($inputValue.trim())}
		let:value
		placeholder="Filter..."
		bind:ref
		let:active
		on:expanded
		autofocus={true}
		bind:inputValue={$inputValue}
		onSelect={async (value) => {
			if ("values" in value && value.values) {
				selectedCondition = value;
				console.log("arguments", value.values);
				stack.push(await value.values(undefined, $page));
				inputValue.set("");
			} else {
				// if we require a value, then ask for input
				// otherwise, push this where filter to our object
				// check selectedcondition for type !== boolean
				console.log({ selectedCondition });
				selectedValueId = value.id;
				// todo: switch to pattern matching
				if (selectedCondition?.type && selectedCondition?.type !== "boolean") {
					//ask for input by matching type with component
					dialogTitle = `Filter by ${selectedCondition.title}`;
					show_input = true;
				} else if (selectedCondition?.field && selectedCondition?.type === "boolean") {
					whereInputs = [
						...whereInputs,
						{
							[selectedCondition.field]: value.where,
						},
					];
					chosenCondition = {
						...selectedCondition,
						value: {
							where: value.where,
							id: value.id,
							value: value.title,
						},
					};
					dispatch("close");
					dispatch("save", chosenCondition);
					console.log("whereInputs", whereInputs);
					// stack.pop()
				} else {
					// we shuoldn't be here
					console.error("no values");
				}
			}
		}}
		onEscape={() => {
			console.log("undo");
			if ($stack.first) {
				dispatch("close");
			} else {
				stack.undo();
			}
		}}
	>
		<div let:active class="flex h-8 items-center gap-2 px-2 text-sm">
			{#if value.icon}
				<Icon
					className="h-4 w-4 {active
						? 'fill-gray-700 dark:fill-gray-200'
						: 'fill-black/50 dark:fill-white/50'}"
					name={value.icon}
				/>
			{/if}
			<span class="grow {active ? 'dark:text-gray-100' : 'text-gray-700 dark:text-gray-100'}"
				>{value.title}</span
			>
		</div>
	</GenericCombobox>
</div>
{#if selectedCondition?.type && selectedCondition?.type !== "boolean"}
	<GenericDialog bind:isOpen={show_input} done_button={false}>
		{@const input = inputComponents[selectedCondition.type]}

		<div slot="title">{dialogTitle}</div>
		<form class="p-4">
			<svelte:component
				this={inputComponents[selectedCondition.type].component}
				bind:value
				{...inputComponents[selectedCondition?.type].props}
				on:keydown={async (event) => {
					if (event.key === "Enter") {
				
					if (selectedCondition?.values) {
						const c = (await selectedCondition.values(value, $page)).find((v) => v.id === selectedValueId);
						if (!c) return;
						if (selectedCondition.field && selectedValueId) {
							chosenCondition = {
								...selectedCondition,
								value: {
									where: c?.where,
									id: c.id,
									value,
									title: c.title,
								},
							};
							if (chosenCondition) dispatch("save", chosenCondition);
						}
					}
					show_input = false;
					dispatch("close");
				}
				}}
			/>
		</form>
		<div class="flex justify-end gap-3" slot="bottom">
			<Button variant="ghost" on:click={() => (show_input = false)}>Cancel</Button>
			<Button
				variant="confirm"
				on:click={async () => {
					if (selectedCondition?.values) {
						const c = (await selectedCondition.values(value, $page)).find((v) => v.id === selectedValueId);
						if (!c) return;
						if (selectedCondition.field && selectedValueId) {
							chosenCondition = {
								...selectedCondition,
								value: {
									where: c?.where,
									id: c.id,
									value,
									title: c.title,
								},
							};
							if (chosenCondition) dispatch("save", chosenCondition);
						}
					}
					show_input = false;
					dispatch("close");
				}}>Confirm</Button
			>
		</div>
	</GenericDialog>
{/if}
