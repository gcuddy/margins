<script lang="ts">
	import type { IconName } from "$lib/icons";
	import classNames from "classnames";
	import { createPopperActions } from "svelte-popperjs";
	import { fade } from "svelte/transition";

	import Icon from "./helpers/Icon.svelte";
	// all we use here is name...
	// export let icon: StoredComponent | null = null;
	export let icon: IconName | null = null;
	export let fill = "fill-current";
	export let as = "div";

    const [ref, content] = createPopperActions({
        strategy: "fixed"
    });

    export let popup = false;
    let showPopup = false;
	// TODO: tooltip or popover
</script>

<svelte:element
	this={as}
    use:ref
    on:mouseenter={() => showPopup = true}
    on:mouseleave={() => showPopup = false}
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
</svelte:element>
{#if popup && showPopup}
<!-- TODO: figure out why  and lcick causes buggy behavior -->
    <div in:fade|local={{duration:150, delay: 250}} out:fade|local={{duration:150}}   class="bg-base z-30 border border-border rounded-md shadow-lg p-2 w-72" use:content>
        <slot name="popup" />
    </div>
{/if}
