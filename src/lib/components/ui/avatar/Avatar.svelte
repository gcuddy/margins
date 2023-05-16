<script lang="ts">
	import imagestatus, { type ImageLoadingStatus } from '$lib/actions/imagestatus';
	import { writable } from 'svelte/store';

	export let src: string | undefined = undefined;
	export let alt: string | undefined = undefined;

	const loading_status = writable<ImageLoadingStatus>('idle');
</script>

<span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
	<!-- TOdo -->
	{#if src && $loading_status !== 'error'}
		<slot name="image" status={$loading_status}>
			<img
				class="aspect-square h-full w-full object-cover"
				use:imagestatus={loading_status}
				{src}
				{alt}
			/>
		</slot>
	{/if}
	{#if $loading_status !== 'loaded'}
		<slot name="fallback">
			<span
				class="absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-muted"
			>
				<slot />
			</span>
		</slot>
	{/if}
</span>
