<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { derived, writable } from 'svelte/store';
	import Elevation from './Elevation.svelte';
	import Combobox from './helpers/Combobox.svelte';

	type T = $$Generic;

	type Value = T & {
		name: string;
		id: string | number;
	};

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
	$: console.log({ selectedValue });

	export let inputValue = '';
	let staticProp = false;
	export { staticProp as static };
	export let filter: (x: typeof values[number], value: string) => boolean = (v) =>
		v.name.toLowerCase().includes(inputValue);

	$: filteredValues = values.filter((v) => filter(v, inputValue));

	export let ref: HTMLElement | undefined = undefined;

	export let placeholder = '';

	export let height = tweened(200, {
		duration: 125,
	});

	onMount(() => {
		if (autofocus && ref) {
			ref.focus();
		}
	});
</script>

<Combobox
	class="max-w-lg overflow-hidden rounded-lg text-gray-100 shadow-xl  ring-1 transparency:bg-gray-800/90 transparency:backdrop-blur-xl transparency:backdrop-brightness-75 transparency:backdrop-contrast-75 transparency:backdrop-saturate-200 dark:ring-gray-500/10"
	input={{
		class: 'bg-inherit text-sm',
		placeholder,
	}}
	inputParent={{
		class: 'border-b border-gray-700',
	}}
	options={{
		class: 'py-1',
	}}
	static={staticProp}
	fillValue={false}
	bind:inputRef={ref}
	bind:height
	values={filteredValues}
	bind:selectedValue
	bind:value={inputValue}
	on:select={(e) => onSelect(e.detail)}
	on:keydown={onKeydown ? (e) => onKeydown && onKeydown(e.detail) : undefined}
>
	<div slot="option" let:value let:active let:selected class="px-2">
		<div class="rounded {active ? 'bg-gray-400/20' : ''}">
			<slot {value} {active} {selected} />
		</div>
	</div>
</Combobox>
