<script lang="ts">
	import type { IconName } from "$lib/icons";
	import classNames from "classnames";
	import { createEventDispatcher } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import type { Readable } from "svelte/store";
	import { fade } from "svelte/transition";

	import Icon from "./helpers/Icon.svelte";
	// all we use here is name...
	// export let icon: StoredComponent | null = null;
	export let icon: IconName | null = null;
	export let fill = "fill-current";
	export let as = "div";

	const [ref, content] = createPopperActions({
		strategy: "fixed",
	});

	const dispatch = createEventDispatcher<{
		showPopup: void;
		hidePopup: void;
	}>();

	export let popup = false;
	let showPopup = false;

	export let onPopup:
		| (<T>() => void | T | Readable<{ data: T; isLoading: boolean }>)
		| undefined = undefined;
	// TODO: tooltip or popover
</script>

<svelte:element
	this={as}
	use:ref
	on:mouseenter={() => {
		showPopup = true;
		dispatch("showPopup");
	}}
	on:mouseleave={() => {
		showPopup = false;
		dispatch("hidePopup");
	}}
	class={classNames(
		"leading-sm flex h-6 w-max min-w-fit max-w-[112px] cursor-default items-center justify-center gap-1 overflow-hidden rounded-full  border border-border text-xs text-muted/70 transition hover:bg-elevation-hover hover:text-bright",
		{
			"pr-2 pl-1.5": icon,
			"px-2": !icon,
		}
	)}
>
	{#if icon}
		<!-- Heroicons solid Tag (TODO: make it be in a component) -->
		<Icon name={icon} className="h-3.5 w-3.5 {fill}" />
	{/if}
	<span><slot /></span>
	{#if popup && showPopup}
		<!-- TODO: figure out why  and lcick causes buggy behavior -->
		<div
			in:fade|local={{ duration: 150, delay: 250 }}
			out:fade|local={{ duration: 150 }}
			class="z-30 w-72 rounded-md border border-border bg-base p-2 shadow-lg"
			use:content
		>
			<slot name="popup" />
		</div>
	{/if}
</svelte:element>
