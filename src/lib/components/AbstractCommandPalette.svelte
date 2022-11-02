<script lang="ts">
	import {
		Combobox,
		ComboboxInput,
		ComboboxOptions,
		ComboboxOption,
	} from '$lib/packages/hui/index';
	export let value = '';
	export let values = [];
	let results = [];

	export let title: (item: any) => string;
	export let image: (item: any) => string | undefined = undefined;
	export let description: (item: any) => string | undefined = undefined;
	/**
	 * a function that returns a promise
	 *
	 */
	export let filter: (value: string) => any[] | Promise<any[]>;
	export let onChange: (e: CustomEvent<any>) => void | undefined = undefined;

	const setResults = async () => {
		results = await filter(value);
	};
	$: if (value) {
		console.log({ filter });
		setResults();
	} else {
		results = values;
	}
</script>

<Combobox bind:value on:change={onChange}>
	<ComboboxInput on:change={(e) => (value = e.detail)} />
	<ComboboxOptions>
		{#each results as result}
			<ComboboxOption
				value={result}
				class={({ active }) => {
					return active ? 'bg-gray-100' : '';
				}}
			>
				{#if image}
					<img src={image(result)} alt="" />
				{/if}
				<div>
					{title(result)}
				</div>
				{#if description}
					—
					<div>
						{description(result)}
					</div>
				{/if}
			</ComboboxOption>
		{/each}
	</ComboboxOptions>
</Combobox>
