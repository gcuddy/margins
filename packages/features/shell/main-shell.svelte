<script lang="ts">
	import ShellHeader from './shell-header.svelte';
</script>

<main
	class="bg-background-elevation relative mb-2 mr-2 mt-2 flex flex-auto grow flex-col place-items-stretch overflow-auto rounded border-[0.5px] shadow-md"
>
	{#if $$slots.header}
		<ShellHeader>
			<slot name="header" />
		</ShellHeader>
	{/if}
	<slot />
</main>
