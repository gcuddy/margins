<script lang="ts">
	import type { IconName } from "$lib/icons";
	import classNames from "classnames";

	import Icon from "./helpers/Icon.svelte";
	// all we use here is name...
	// export let icon: StoredComponent | null = null;
	export let icon: IconName | null = null;
	export let fill = "fill-muted/60";
	export let as = "div";
	// TODO: tooltip or popover
</script>

<svelte:element
	this={as}
	class={classNames(
		"leading-sm flex h-6 w-max min-w-fit max-w-[112px] cursor-default items-center justify-center gap-1 overflow-hidden rounded-full  border border-border text-xs text-muted/70 transition hover:bg-elevation-hover",
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
</svelte:element>
