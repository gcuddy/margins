<script lang="ts">
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import { Muted, H1, Lead } from '$components/ui/typography';
	import { getYear } from '$lib/utils/date';
	import { createAvatar, melt } from '@melt-ui/svelte';

	export let image = '';
	export let type = '';
	export let title = '';
	export let author = '';
    export let published: Date | string = '';

	const {
		elements: { image: img, fallback }
	} = createAvatar({
		src: image ?? ''
	});
</script>

<div class="flex items-center gap-6">
	<div class={'aspect-auto max-w-[200px] rounded-md shadow-lg'}>
		<img use:melt={$img} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span use:melt={$fallback}>
			<Skeleton class="h-full w-full rounded-[inherit]" />
		</span>
	</div>

	<div class="flex flex-col gap-2">
		<Muted>{type}</Muted>
		<H1>{title}</H1>
		<Lead>
			{author} — {getYear(published)}
		</Lead>
        <slot />
		{#if $$slots.buttons}
			<div class="flex items-center gap-2">
				<slot name="buttons" />
			</div>
		{/if}
	</div>
</div>
