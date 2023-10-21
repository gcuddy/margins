<script lang="ts">
	import type { Annotation, Color } from "@prisma/client";
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
	} from "@rgossiaux/svelte-headlessui";
	import { createEventDispatcher } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import ColorCombobox from "./ColorCombobox.svelte";
	import ColorSwatch from "./ColorSwatch.svelte";
	import Icon from "./helpers/Icon.svelte";
	const dispatch = createEventDispatcher<{
		color: Color;
		edit: {
			annotation: Annotation;
		};
		delete: undefined;
	}>();
	export let labels = true;
	export let annotation: Annotation;
	$: console.log({ annotation });

	const [ref, content] = createPopperActions();

	function handleSelect(e: CustomEvent) {
		const color = e.detail.id as Color;
		if (color) {
			annotation.color = color;
			dispatch("color", color);
		}
	}
</script>

<div
	class="grid grid-cols-12 gap-1 border-gray-100 p-1 shadow-lg dark:border-gray-50 dark:text-white"
>
	<!-- currently using pointerdown so we can beat the selection being cleared -->
	{#if annotation?.body || annotation.contentData}
		<button
			class="col-span-4 flex shrink-0 flex-col items-center rounded-md  p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={(e) => {
				dispatch("edit", {
					annotation,
				});
			}}
			><Icon name="pencilAlt" />
			{#if labels}<span class="text-xs">edit</span>{/if}</button
		>
	{:else}
		<button
			class="col-span-4 flex shrink-0 flex-col items-center rounded-md  p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={(e) => {
				dispatch("annotate", { annotation });
			}}
			><Icon name="pencilAlt" />
			{#if labels}<span class="text-xs">annotate</span>{/if}</button
		>
	{/if}
	<button
		class="col-span-4 flex shrink-0 flex-col items-center rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
		on:click={() => dispatch("delete")}
		><Icon name="trash" />
		{#if labels}<span class="text-xs">delete</span>{/if}</button
	>
	<div
		class="col-span-1 h-full w-[1px] place-self-center bg-black/10 dark:bg-white"
	/>
	<Popover
		let:close
		class="group col-span-3 flex  shrink-0 items-center  justify-center rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
	>
		<PopoverButton use={[ref]} class="flex flex-col items-center justify-center"
			><ColorSwatch
				--swatchSize="{6 * 4}px"
				as="div"
				hover={false}
				hex="var(--highlight-{annotation?.color.toLowerCase()})"
			/>
			{#if labels}<span class="text-xs">color</span>{/if}</PopoverButton
		>
		<PopoverPanel use={[content]}>
			<ColorCombobox
				on:select={(e) => {
					handleSelect(e);
					close(null);
				}}
			/>
		</PopoverPanel>
	</Popover>
</div>
