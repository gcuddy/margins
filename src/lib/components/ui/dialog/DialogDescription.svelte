<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import { DialogDescription } from "@rgossiaux/svelte-headlessui";
	import type { HTMLBaseAttributes } from "svelte/elements";
	interface $$Props extends HTMLBaseAttributes {}
</script>

<DialogDescription
	class={cn("text-sm text-muted-foreground", $$props.class)}
	{...$$restProps}><slot /></DialogDescription
>
