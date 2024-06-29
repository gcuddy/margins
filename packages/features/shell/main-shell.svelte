<script lang="ts">
	import ShellHeader from './shell-header.svelte';
</script>

<main
	class="dark:bg-sandA-2 relative mb-2 mr-2 mt-2 flex flex-auto grow flex-col place-items-stretch overflow-auto bg-white rounded-lg ring-1 ring-grayA-5"
>
	{#if $$slots.header}
		<ShellHeader>
			<slot name="header" />
		</ShellHeader>
	{/if}
	<slot />
</main>
