<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	let c = "";
	export { c as class };
</script>

<ul class={cn("flex flex-wrap items-center justify-start", c)}>
	<slot />
</ul>
