<script lang="ts">
	import { ComponentProps, onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { derived, writable } from "svelte/store";
	import type { string } from "ts-pattern/dist/patterns";
	import Elevation from "./Elevation.svelte";
	import Combobox from "./helpers/Combobox.svelte";

	type T = $$Generic<{
		id: string | number;
		name?: string;
	}>;

	type Value = T;

	interface $$Slots {
		default: {
			value: Value;
			active: boolean;
			selected: boolean;
		};
	}

	export let values: Value[];
	export let autofocus = false;

	export let onSelect: (value: Value) => void = () => {};
	export let onKeydown: ((event: KeyboardEvent) => void) | undefined = undefined;

	export let selectedValue: Value[] = [];
	export let multiple = false;
	$: console.log({ multiple });
	$: console.log({ selectedValue });

	export let inputValue = "";
	let staticProp = false;
	export { staticProp as static };
	export let filter: (x: typeof values[number], value: string) => boolean = (v) =>
		!!v.name?.toLowerCase().includes(inputValue);

	$: filteredValues = values.filter((v) => filter(v, inputValue));

	export let ref: HTMLElement | undefined = undefined;

	export let placeholder = "";

	export let height = tweened(200, {
		duration: 125,
	});

	interface $$Props extends ComponentProps<Combobox<Value>> {
		ref?: HTMLElement | undefined;
		placeholder?: string;
		height?: typeof height;
		inputValue?: string;
		filter?: typeof filter;
		static?: typeof staticProp;
		selectedValue?: Value[];
		onKeydown?: typeof onKeydown;
		onSelect?: typeof onSelect;
		autofocus?: typeof autofocus;
		values: Value[];
	}

	onMount(() => {
		if (autofocus && ref) {
			ref.focus();
		}
	});
</script>

<Combobox
	class="max-w-lg relative overflow-hidden rounded-lg bg-elevation transparency:bg-elevation/70 transparency:backdrop-blur-3xl transparency:backdrop-saturate-200  text-gray-700  shadow-2xl ring-1 ring-border dark:ring-gray-500/10 dark:transparency:bg-black/50 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200"
	input={{
		class: "bg-inherit text-sm",
		placeholder,
	}}
	inputParent={{
		class: "border-b border-border",
	}}
	options={{
		class: "py-1 overflow-auto max-h-52 simple-scrollbar",
	}}
	static={staticProp}
	fillValue={false}
	bind:inputRef={ref}
	bind:height
	values={filteredValues}
	bind:selectedValue
	{multiple}
	bind:value={inputValue}
	on:select={(e) => onSelect(e.detail)}
	on:select
	on:expanded
	on:keydown={onKeydown ? (e) => onKeydown && onKeydown(e.detail) : undefined}
	{...$$restProps}
>
	<div slot="option" let:value let:active let:selected class="px-2">
		<div class="rounded {active ? 'bg-black/10 dark:bg-gray-400/20' : ''}">
			<slot {value} {active} {selected} />
		</div>
	</div>
</Combobox>
