<script lang="ts">
	import GenericCombobox from "./GenericCombobox.svelte";
	import { Color } from "@prisma/client";
	import { page } from "$app/stores";
	import ColorListItem from "./Color/ColorListItem.svelte";
	const getName = (c: Color) => color_descriptions?.find(({ color }) => color === c)?.description || c;
	$: color_descriptions = $page.data.user?.color_descriptions;
	$: colors = Object.values(Color).map((c) => ({ name: getName(c), id: c }));
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
