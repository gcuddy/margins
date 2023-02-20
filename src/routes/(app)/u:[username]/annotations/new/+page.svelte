<script lang="ts">
	import GenericInput from "$lib/components/GenericInput.svelte";
	import TipTap from "$lib/components/TipTap.svelte";
</script>

<h1>New note</h1>
<div class="container flex flex-col mx-auto">
	<GenericInput placeholder="Untitled" />
	<TipTap />
</div>
