<script lang="ts">
	import GenericCombobox from "./GenericCombobox.svelte";
	import { page } from "$app/stores";
	import ColorListItem from "./Color/ColorListItem.svelte";
	import type { Color } from "$lib/features/colors";
	import { colors as Colors } from "$lib/features/colors";
	$: color_descriptions = $page.data.user?.color_descriptions;
	const getName = (c: Color) =>
		color_descriptions?.find(({ color }) => color === c)?.description || c;
	$: colors = Colors.map((c) => ({ name: getName(c), id: c }));
	$: console.log({ colors });
	export let selected: Color = "Yellow";
	let selectedValue = [{ name: getName(selected), id: selected }];
	$: selectedValue, (selected = selectedValue[0].name as Color);
</script>

<GenericCombobox
	on:select
	on:expanded
	values={colors}
	bind:selectedValue
	autofocus
	static
	let:value={color}
	let:active
	let:selected
>
	<ColorListItem {color} {active} {selected} />
</GenericCombobox>
