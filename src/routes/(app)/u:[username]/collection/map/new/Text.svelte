<script lang="ts">
	import resize from "$lib/actions/resize";

	export let editing = false;
	export let value: string;

	export let height: number;

	let actualHeight: number;

	$: scale = height / actualHeight;
	$: console.log({ scale, height, actualHeight });
</script>

<div style="width:max-content; transform:scale({scale});">
	{#if editing}
		<textarea
			autofocus
			class="resize-none overflow-hidden rounded border-0 p-0 focus:ring-0 "
			bind:value
			on:blur={() => (editing = false)}
			rows="1"
		/>
	{:else}
		<div
			use:resize={(e) => {
				actualHeight = e.borderBoxSize[0].inlineSize;
			}}
			on:dblclick={() => (editing = true)}
		>
			{value}
		</div>
	{/if}
</div>
