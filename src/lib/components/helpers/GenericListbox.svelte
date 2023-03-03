<script lang="ts">
	import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@rgossiaux/svelte-headlessui";
	import type { ComponentProps } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import AnimationDisabler from "./AnimationDisabler.svelte";
	type T = $$Generic;
	export let value: T;
	export let values: T[] | Promise<T[]>;
	export let name: string | undefined = undefined;
	export let onChange: ((value: T) => void) | undefined = undefined;

	interface $$Props extends ComponentProps<Listbox<"div">> {
		value: T;
		values: T[];
		onChange?: ((value: T) => void) | undefined;
		name?: string;
	}

	const [ref, content] = createPopperActions({
		placement: "bottom-start",
	});
</script>

<Listbox
	{value}
	{...$$restProps}
	let:open
	on:change={(e) => {
		value = e.detail;
		onChange && onChange(e.detail);
	}}
>
	{#if name}
		<input {name} type="hidden" {value} />
	{/if}
	<ListboxButton as="div" use={[ref]}><slot name="button" {value} /></ListboxButton>
	{#if open}
		<ListboxOptions
			static
			use={[content]}
			class="z-20 flex w-56 flex-col divide-y divide-gray-100 rounded-md bg-gray-50/90 p-1 opacity-100 shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none  dark:divide-gray-700 dark:bg-zinc-900/50 dark:text-current dark:ring-gray-400/20 dark:backdrop-blur-md dark:backdrop-brightness-75 dark:backdrop-contrast-75 dark:backdrop-saturate-200 "
		>
			{#await values then values}
				{#each values as value}
					<ListboxOption
						let:active
						let:selected
						{value}
						class={({ active }) =>
							`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
								active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
							}`}><slot {active} {selected} {value} /></ListboxOption
					>
				{/each}
			{/await}
		</ListboxOptions>
	{/if}
</Listbox>
