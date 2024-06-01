<script lang="ts">
	import { cn } from '@margins/lib';
	import { PinStore } from '../data/pin.js';
	import { getReplicache } from '../replicache/index.js';

	const rep = getReplicache();

	const pins = PinStore.list.watch(
		() => rep,
		() => [],
	)();

	// $: console.log({ $pins });
</script>

<ul class="min-w-0">
	{#each $pins as pin}
		<li class="truncate">
			{#if pin.entry}
				<!-- TODO: link -->
				<a
					href=""
					class={cn(
						'hover:bg-sandA-3 my-px flex w-full items-center justify-start truncate rounded px-3 py-2 text-left text-sm font-medium',
						'truncate',
					)}
				>
					<span class="truncate">
						{pin.entry.title}
					</span>
				</a>
			{/if}
		</li>
	{/each}
</ul>
