<script lang="ts">
	import { statusesWithIcons, type Status, isStatus } from '$lib/status';
	export let status: Status | string | undefined | null;
	let className = '';
export { className as class };

	$: _status = isStatus(status) ? status : null;
</script>

{#if _status}
	<svelte:component this={statusesWithIcons[_status]} class={className} />
{/if}
