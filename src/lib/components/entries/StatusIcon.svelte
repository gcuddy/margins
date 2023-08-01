<script lang="ts">
	import { statusesWithIcons, type Status } from '$lib/status';
	export let status: Status | undefined;
	let className = '';
	export { className as class };
</script>

{#if status}
	<svelte:component this={statusesWithIcons[status]} class={className} />
{/if}
