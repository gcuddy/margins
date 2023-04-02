<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {
		class?: string;
	}
</script>

<div class={cn(className)} {...$$restProps} role="group">
	<slot />
</div>
