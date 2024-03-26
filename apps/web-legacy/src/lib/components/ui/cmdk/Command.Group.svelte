<script lang="ts">
	import { useCommand, useState } from "./Command.Root.svelte";
	import { useId } from "$lib/hooks/use-id";
	import { type ComponentType, setContext } from "svelte";
	import type { HTMLBaseAttributes } from "svelte/elements";

	const id = useId().toString();
	const headingId = useId().toString();

	let ref: HTMLElement;
	let headingRef: HTMLElement | undefined = undefined;

	const context = useCommand();
	const state = useState();

	interface $$Props extends HTMLBaseAttributes {
		/** Optional heading to render for this group. */
		heading?: ComponentType | string;
		/** If no heading is provided, you must provide a value that is unique for this group. */
		value?: string;
	}
	export let heading: ComponentType | string | undefined = undefined;
	export let value: string | undefined = undefined;

	$: render =
		$context.filter() === false
			? true
			: !$state.search
			? true
			: $state.filtered.groups.has(id);

	setContext("cmdk_group", id);

	$: $context.group(id);

	$: computedValue = (
		value || (heading && typeof heading === "string")
			? (heading as string)
			: "" || headingRef?.textContent
	)
		?.trim()
		.toLowerCase();

	$: if (computedValue) {
		$context.value(id, computedValue);
		ref?.setAttribute("data-value", computedValue);
	}
</script>

<div
	data-cmdk-group
	bind:this={ref}
	{...$$restProps}
	role="presentation"
	hidden={render ? undefined : true}
>
	{#if heading}
		<div
			bind:this={headingRef}
			data-cmdk-group-heading
			aria-hidden
			id={headingId}
		>
			{#if typeof heading === "string"}
				{heading}
			{:else}
				<svelte:component this={heading} />
			{/if}
		</div>
	{/if}
	<div
		data-cmdk-group-items
		role="group"
		aria-labelledby={heading ? headingId : undefined}
	>
		<slot />
	</div>
</div>
