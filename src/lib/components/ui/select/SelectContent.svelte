<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption,
		Portal,
	} from "@rgossiaux/svelte-headlessui";
	import { getSelectContext } from "./Select.svelte";
	import { getContext } from "svelte";
	import type { Readable } from "svelte/store";
	import { fade } from "svelte/transition";
	let className = "";
	export { className as class };

	const { popperContent } = getSelectContext();

	const api: Readable<{
		listboxState: number;
	}> = getContext("headlessui-listbox-context");

	$: open = $api.listboxState === 0;
</script>

{#if open}
	<div
		use:popperContent={{
			placement: "bottom-start",
			strategy: "fixed",
			modifiers: [
				{
					name: "offset",
					options: {
						offset: [0, 8],
					},
				},
			],
		}}
	>
		<div transition:fade|global>
			<ListboxOptions
				class={cn(
					"relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
					// position === "popper" && "translate-y-1",
					className
				)}
			>
				<slot />
			</ListboxOptions>
		</div>
	</div>
{/if}
