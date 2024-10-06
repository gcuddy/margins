<script lang="ts">
	import type { Props } from './heading.props';

	let { children, as = 'h1' }: Props = $props();
</script>

<svelte:element this={as}>
	{@render children()}
</svelte:element>
