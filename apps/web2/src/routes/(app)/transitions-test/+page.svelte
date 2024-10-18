<script lang="ts">
	import { receive, send } from '$lib/transition';

	let { data } = $props();

	let rowCol = $derived(data.rowCol?.split(':').map(Number) ?? [0, 0]);
</script>

<form>
	<input
		class="text-5 bg-transparent text-gray-12"
		type="text"
		value={rowCol.join(':')}
		name="row-col"
	/>
</form>
<div class="grid grid-cols-3 w-full h-full grid-rows-3">
	{#key rowCol}
		<div
			in:send={{ key: 'rowCol' }}
			out:receive={{ key: 'rowCol' }}
			style:--row={rowCol[0]}
			style:--col={rowCol[1]}
			class="col-start-[--col] row-start-[--row] h-full w-full bg-orange-9"
		></div>
	{/key}
</div>
