<script lang="ts">
	import { DialogOverlay } from "@rgossiaux/svelte-headlessui";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import { fade } from "svelte/transition";
	interface $$Props extends HTMLBaseAttributes {}
</script>
<!-- fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in -->
<div>
	<DialogOverlay
		{...$$restProps}
		class={({ open }) =>
			cn(
				"fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in",
				{
					"animate-out fade-out": !open,
					"fade-in": open,
				},
				$$props.class
			)}
	/>
</div>
