<script lang="ts">
	import { slide } from "svelte/transition";
	export let visible = false;
	export let className = "";
	export let id = Math.random().toString(36).substring(2, 15);
</script>

<button
	aria-expanded={visible}
	class={className}
	on:click={() => (visible = !visible)}
	aria-controls={id}
>
	<slot name="button" />
</button>
{#if visible}
	<div transition:slide={{ duration: 100 }} {id}>
		<slot name="content" />
	</div>
{/if}
