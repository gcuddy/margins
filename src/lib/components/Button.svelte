<script lang="ts">
	import type { IconName } from "$lib/icons";
	import { show_tooltips } from "$lib/stores/Tooltips";
	import { createEventDispatcher } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { fly } from "svelte/transition";
	import ButtonTooltip from "./ButtonTooltip.svelte";
	import Icon from "./helpers/Icon.svelte";

	interface Tooltip {
		text: string;
		kbd?: string;
	}

	export let type: "submit" | "reset" | "button" | undefined = undefined;
	export let formaction: string | undefined = undefined;
	export let disabled: boolean = false;
	export let className = "";
	export let scaleOnHover = false;
	export let squishy = false;
	export let tooltip: Tooltip | undefined = undefined;
	export let prefetch = true;

	/**readonly*/
	export let el: HTMLElement | undefined = undefined;

	const [popperRef, popperContent] = createPopperActions({
		placement: "bottom",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, 8],
				},
			},
		],
	});

	export let variant:
		| "primary"
		| "ghost"
		| "confirm"
		| "link"
		| "dashed"
		| "transparent"
		| "naked"
		| "gradient" = "primary";
	export let size: "sm" | "md" | "lg" | "xl" = "md";
	export let color: "primary" | "ghost" | undefined = undefined;

	export let as: string = "button";

	export let href: string | undefined = undefined;

	$: _classname = `relative flex h-7 shrink-0 cursor-default select-none appearance-none items-center justify-center truncate rounded-lg transition font-medium shadow-sm focus-visible:ring disabled:opacity-60 ${
		squishy ? "active:scale-95 transition duration-300" : ""
	}  ${scaleOnHover ? "hover:scale-105" : ""}
    ${
			size === "md"
				? "text-sm px-2"
				: size === "sm"
				? "text-xs px-2"
				: size === "lg"
				? "text-base p-4"
				: "text-lg p-4"
		}
    ${
			variant === "ghost"
				? "border border-gray-300 bg-elevation/90 text-gray-600 hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-300  dark:hover:text-gray-200"
				: ""
		}
    ${
			variant === "gradient"
				? "bg-gradient-to-r from-amber-700 to-yellow-700 "
				: ""
		}
    ${
			variant === "confirm" &&
			"border bg-lime-200 border-lime-400 hover:bg-lime-300 hover:border-lime-500 dark:bg-lime-700 hover:dark:bg-lime-600"
		}
    ${
			variant === "primary" &&
			"bg-accent dark:text-amber-900 hover:bg-accent-hover dark:hover:bg-amber-300 text-accent-text"
		}
    ${variant === "link" && "bg-transparent shadow-none"}
    ${
			variant === "dashed" &&
			"bg-transparent shadow-none border border-dashed dark:border-gray-500 dark:text-gray-200 dark:hover:text-gray-50"
		}
    ${
			variant === "transparent" &&
			"bg-white/20 hover:bg-white/30 focus:bg-white/30 text-gray-900 dark:text-gray-50"
		}
        ${
					variant === "naked" &&
					"bg-transparent shadow-none hover:bg-base-hover dark:hover:bg-gray-700"
				}
    ${className}`;

	let tooltip_visible = false;
	let tooltip_timeout: ReturnType<typeof setTimeout> | undefined;
	function showTooltip() {
		// show tooltip after 300 msecond delay
		// if show_tooltips is true, then just show it — means we already we're hovering over another one
		if ($show_tooltips) {
			tooltip_visible = true;
		}
		tooltip_timeout = setTimeout(() => {
			tooltip_visible = true;
			show_tooltips.set(true);
		}, 500);
	}
	function hideTooltip() {
		clearTimeout(tooltip_timeout);
		tooltip_visible = false;
		// in 300ms set hide_tooltips to false
		setTimeout(() => {
			show_tooltips.set(false);
		}, 300);
	}

	const dispatch = createEventDispatcher();

	function handleClick(e: MouseEvent) {
		hideTooltip();
	}

	function handleMouseLeave(e: MouseEvent) {
		hideTooltip();
		dispatch("mouseleave", e.detail);
	}

	function handlemouseenter(e: MouseEvent) {
		showTooltip();
		dispatch("mouseenter", e.detail);
	}

	// TODO: tooltips
</script>

<!-- TODO: don't repeat these damn classes! -->

{#if as === "a"}
	<!-- this is a monstrosity but use actions can't be applied conditionally; should probably wrap the action myself -->
	{#if tooltip}
		<a
			bind:this={el}
			{href}
			use:popperRef
			on:click={handleClick}
			on:click
			on:mouseenter
			on:mouseenter={handlemouseenter}
			on:mouseleave={handleMouseLeave}
			class={_classname}
			aria-label={tooltip.text}
		>
			<slot>Button</slot>
		</a>
	{:else}
		<a
			bind:this={el}
			{href}
			on:click
			on:mouseenter={handlemouseenter}
			on:mouseleave={handleMouseLeave}
			class={_classname}
		>
			<slot>Button</slot>
		</a>
	{/if}
{:else if tooltip}
	<svelte:element
		this={as}
		bind:this={el}
		{type}
		{disabled}
		{href}
		on:click={handleClick}
		on:click
		use:popperRef
		on:mouseenter={handlemouseenter}
		on:mouseleave={handleMouseLeave}
		class={_classname}
		{formaction}
		aria-label={tooltip.text}
		{...$$restProps}
	>
		<slot>Button</slot>
	</svelte:element>
{:else}
	<svelte:element
		this={as}
		bind:this={el}
		{type}
		{disabled}
		{href}
		{formaction}
		on:click={handleClick}
		on:click
		on:mouseenter={handlemouseenter}
		on:mouseleave={handleMouseLeave}
		class={_classname}
		{...$$restProps}
	>
		<slot>Button</slot>
	</svelte:element>
{/if}

{#if tooltip && tooltip_visible}
	<!-- todo: add delay -->
	<div use:popperContent class="z-50">
		<div transition:fly|local={{ y: 5, duration: 150 }}>
			<ButtonTooltip {...tooltip} />
		</div>
	</div>
{/if}
