<script lang="ts">
	import { SmallPlus } from '@margins/ui';
	import { PinStore } from '../data/pin.js';
	import { getReplicache } from '../replicache/index.js';

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
				<!-- TODO: link -->
				<span>
					<SmallPlus>
						{pin.entry.title}
					</SmallPlus>
				</span>
			{/if}
		</li>
	{/each}
</ul>
