<script lang="ts">
	import { getPopoverContext } from "$lib/components/ui/popover/Popover.svelte";
	import { cn } from "$lib/utils/tailwind";
	import { PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui";
	import { ComponentProps, createEventDispatcher, getContext } from "svelte";
	import type { HTMLFormAttributes } from "svelte/elements";
	import type { Readable } from "svelte/store";
	import { fade, fly } from "svelte/transition";
	let className = "";
	export { className as class };
	interface $$Props extends ComponentProps<PopoverPanel<"div" | "form">> {
		class?: string;
	}

	const { popperContent } = getPopoverContext();

	const api: Readable<{
		popoverState: number;
	}> = getContext("headlessui-popover-context");

	$: open = $api.popoverState === 0;

	$: console.log({ $api, open });

	export let popperOpts = {};
	const dispatch = createEventDispatcher<{
		open: { open: boolean };
	}>();
	$: open, dispatch("open", { open });
</script>

<!-- portal? -->

<!-- animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2  -->
{#if open}
	<div use:popperContent>
		<div transition:fly={{ y: 20, duration: 200 }}>
			<PopoverPanel
				{...$$restProps}
				class={cn(
					"z-50 w-72 rounded-md border border-gray-100 bg-white p-4 shadow-md outline-none  dark:border-gray-800 dark:bg-gray-800",
					className
				)}
			>
				<slot />
			</PopoverPanel>
		</div>
	</div>
{/if}
