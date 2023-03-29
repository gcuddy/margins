<script lang="ts">
	import { DialogOverlay } from "@rgossiaux/svelte-headlessui";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	interface $$Props extends HTMLBaseAttributes {}
</script>

<DialogOverlay
	{...$$restProps}
	class={({ open }) =>
		cn(
			"fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out",
			{
				"animate-out fade-out": !open,
				"fade-in": open,
			},
			$$props.class
		)}
/>
