<script lang="ts">
	import type { Props } from './text.props';

	let { children, as = 'span', size }: Props = $props();
</script>

<svelte:element this={as}>
	{@render children()}
</svelte:element>
