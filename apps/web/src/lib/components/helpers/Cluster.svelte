<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	let c = '';
	export { c as class };

	export let as = 'div';
</script>

<svelte:element this={as} class={cn('flex flex-wrap items-center justify-start', c)}>
	<slot />
</svelte:element>
