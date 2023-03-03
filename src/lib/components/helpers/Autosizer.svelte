<script lang="ts">
	export let height = 604000;
	let ticking = false;
</script>

<div class="grow" bind:offsetHeight={height}>
	<slot {height} />
</div>
