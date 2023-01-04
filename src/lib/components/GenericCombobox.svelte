<script lang="ts">
	import { derived, writable } from 'svelte/store';
	import Elevation from './Elevation.svelte';
	import Combobox from './helpers/Combobox.svelte';

	type T = $$Generic;

	type Value = T & {
		name: string;
		id: string;
	};

	interface $$Slots {
		default: {
			value: Value;
			active: boolean;
		};
	}

	export let values: Value[];

	export let onSelect: (value: Value) => void;
	export let onKeydown: ((event: KeyboardEvent) => void) | undefined = undefined;

	export let inputValue = '';
	let staticProp = false;
	export { staticProp as static };
	export let filter: (x: typeof values[number], value: string) => boolean = (v) =>
		v.name.toLowerCase().includes(inputValue);

	$: filteredValues = values.filter((v) => filter(v, inputValue));

	export let ref: HTMLElement | undefined = undefined;

	export let placeholder = '';
</script>

<Combobox
	class="max-w-lg overflow-hidden rounded-lg text-gray-100 transparency:bg-gray-800/50 transparency:backdrop-blur-xl transparency:backdrop-brightness-75 transparency:backdrop-contrast-75 transparency:backdrop-saturate-200"
	input={{
		class: 'bg-inherit',
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
	values={filteredValues}
	bind:value={inputValue}
	on:select={(e) => onSelect(e.detail)}
	on:keydown={onKeydown ? (e) => onKeydown && onKeydown(e.detail) : undefined}
>
	<div slot="option" let:value let:active class="px-2">
		<div class="rounded {active ? 'bg-gray-400/20' : ''}">
			<slot {value} {active} />
		</div>
	</div>
</Combobox>
