<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
	}
</script>

<div class={cn("border-t bg-gray-50 py-4 dark:bg-gray-900", className)}>
	<slot />
</div>
