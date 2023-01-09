<script lang="ts">
	import type { RouterOutputs } from '$lib/trpc/router';
	import dayjs from '$lib/dayjs';
	import AnnotationWrapper from './annotations/AnnotationWrapper.svelte';
	import { readable } from 'svelte/store';
	import SmallPlus from './atoms/SmallPlus.svelte';
	import Muted from './atoms/Muted.svelte';
	import DotMenu from './DotMenu.svelte';
	import { trpc } from '$lib/trpc/client';
	import { invalidateAll } from '$app/navigation';

	let text: string;
	export let annotation: RouterOutputs['entries']['load']['annotations'][number];

	// REVIEW: should this be reactive? (in case annotation.createdAt is changed (tho it shouldn't be, right?))
	const date = readable(dayjs(annotation.createdAt).fromNow(), (set) => {
		const interval = setInterval(() => {
			set(dayjs(annotation.createdAt).fromNow());
		}, 1000 * 60);

		return function stop() {
			clearInterval(interval);
		};
	});

	let busy = false;
</script>

<!-- if small, show little note instead of text -->
<!-- <div>
	<div class="block h-6 w-6 border-4 border-black/90 bg-yellow-300/90 md:hidden" />
	<div
		class="hidden h-8 max-w-xs overflow-auto border-4 border-2 border-black/90 bg-yellow-100/90 md:block"
	>
		<div class="text-gray-900 dark:text-white">
			{text}
		</div>
	</div>
</div> -->

<AnnotationWrapper class={busy ? 'animate-pulse opacity-50' : ''}>
	<div class="flex w-full flex-col gap-1">
		<div class="flex justify-between">
			<div>
				<SmallPlus>{annotation.creator.username}</SmallPlus>
				<span class="text-xs"><Muted>{$date}</Muted></span>
			</div>
			<div>
				<DotMenu
					offset={[0, 0]}
					strategy="absolute"
					items={[
						[
							{
								label: 'Delete',
								perform: async () => {
									busy = true;
									await trpc().annotations.delete.mutate(annotation.id);
									await invalidateAll();
									busy = false;
								},
							},
						],
					]}
				/>
			</div>
		</div>
		<div>{annotation.body}</div>
	</div>
</AnnotationWrapper>
