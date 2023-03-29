<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import { DialogDescription } from "@rgossiaux/svelte-headlessui";
	import type { HTMLBaseAttributes } from "svelte/elements";
	interface $$Props extends HTMLBaseAttributes {}
</script>

<DialogDescription
	class={cn("text-sm text-slate-500", "dark:text-slate-400", $$props.class)}
	{...$$restProps}><slot /></DialogDescription
>
