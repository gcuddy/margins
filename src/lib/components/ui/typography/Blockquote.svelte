<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<blockquote class={cn("mt-6 border-l-2 pl-6 italic", className)}>
	<slot />
</blockquote>
