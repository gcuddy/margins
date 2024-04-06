<script lang="ts">
	import { PinStore } from '../data/pin.js';
	import { getReplicache } from '../index.js';

	const rep = getReplicache();

	const pins = PinStore.list.watch(
		() => rep,
		() => [],
	)();

	// $: console.log({ $pins });
</script>

<ul>
	{#each $pins as pin}
		<li>
			{#if pin.entry}
				<span>
					{pin.entry.title}
				</span>
			{/if}
		</li>
	{/each}
</ul>
