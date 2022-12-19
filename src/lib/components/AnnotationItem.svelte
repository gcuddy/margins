<script lang="ts">
	export let href: string;
	export let text: string;
	export let html = false;
	export let comment: string;
</script>

<div
	class="relative {'before:content-[""] before:w-1 before:bg-gradient-to-br from-primary-400 to-primary-500 before:rounded-md before:absolute before:h-full m'}"
>
	<a {href} class="block pl-5">
		{#if html}
			{@html text}
		{:else}
			{text}
		{/if}
	</a>
</div>
