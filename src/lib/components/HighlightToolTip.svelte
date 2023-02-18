<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import Swatches from "./ColorPicker/Swatches.svelte";
	import Icon from "./helpers/Icon.svelte";
	const dispatch = createEventDispatcher();
	export let labels = true;

	let container: HTMLElement;
	onMount(() => {
		container?.querySelector("button")?.focus();
	});

	export let color: string | undefined = undefined;
</script>

<div style:--annotationColor={color} class="relative">
	<div
		bind:this={container}
		class="grid grid-cols-4 gap-2 border-gray-100 p-1 dark:border-gray-50 dark:text-white"
	>
		<!-- currently using pointerdown so we can beat the selection being cleared -->
		<button
			class="col-span-2 flex shrink-0 flex-col items-center rounded-md  p-1 transition hover:bg-primary-600/10 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={(e) => {
				dispatch("highlight");
			}}
			><div class="text-[var(--annotationColor)]">
				<Icon name="pencil" />
			</div>
			{#if labels}<span class="text-xs">highlight</span>{/if}</button
		>
		<button
			class="col-span-2 flex shrink-0 flex-col items-center rounded-md p-1 transition hover:bg-primary-600/10 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={() => dispatch("annotate")}
			><div class="text-[var(--annotationColor)]">
				<Icon name="annotation" />
			</div>
			{#if labels}<span class="text-xs">annotate</span>{/if}</button
		>
	</div>
	<button class="absolute" on:pointerdown|preventDefault|stopPropagation={() => dispatch("annotate")}
		><div class="text-[var(--annotationColor)]">
			<Icon name="annotation" />
		</div>
		{#if labels}<span class="text-xs">annotate</span>{/if}</button
	>
	<!-- <div>
		<Swatches class="" />
	</div> -->
</div>
