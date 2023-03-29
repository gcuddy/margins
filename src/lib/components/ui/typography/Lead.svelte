<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<p class={cn("text-xl text-gray-700 dark:text-gray-400", className)}>
	<slot />
</p>
