<script lang="ts">
	import { Popover, PopoverButton, PopoverPanel } from "@rgossiaux/svelte-headlessui";
	import { createPopperActions } from "svelte-popperjs";

	const [button, panel] = createPopperActions({
        placement: "bottom-end",
        strategy: "fixed",
    });
</script>

<Popover>
	<PopoverButton use={[button]}>
		<slot name="button" />
	</PopoverButton>
	<PopoverPanel use={[panel]}>
		<!-- <div class="shadow transform scale-100 bg-elevation transparency:bg-elevation/50 border border-border transparency:backdrop-blur-md transparency:"> -->
		<div class="max-w-lg z-50 relative overflow-hidden rounded-lg bg-elevation transparency:bg-elevation transparency:backdrop-blur-3xl transparency:backdrop-saturate-200  text-gray-700  shadow-2xl ring-1 ring-border dark:ring-gray-500/10 dark:transparency:bg-black/50 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200 origin-top-right transform opacity-100 scale-100">
			<slot name="panel" />
		</div>
	</PopoverPanel>
</Popover>
