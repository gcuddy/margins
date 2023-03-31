<script lang="ts">
	import { getCurrentListContext } from "$lib/stores/currentList";

	const currentList = getCurrentListContext();
</script>

{#if $currentList.entries?.length}
	<div class="m-4 flex flex-col shadow-lg">
		<slot />
	</div>
{:else}
	<slot />
{/if}
