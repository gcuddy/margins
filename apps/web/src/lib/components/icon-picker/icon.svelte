<script lang="ts">
	import { cn } from '$lib/utils';
	import { icons } from './data';

	export let icon: string | undefined | null = 'File';
	export let color: string | undefined | null = '#000000';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<svelte:component
	this={icons.find((i) => i.name === icon)?.component}
	data-color-hex={color}
	class={cn('h-8 w-8 shrink-0 opacity-75 text-[--color]', className)}
	style="--color:{color}"
/>

<style lang="postcss">
	[data-color-hex] {
		color: var(--color);
	}

	:global(.dark) {
		[data-color-hex='#000000'],
		[data-color-hex='#000'] {
			color: #ffffff;
		}
	}

	@media (prefers-color-scheme: dark) {
		:global([data-color-hex='#000000'], [data-color-hex='#000']) {
			color: #ffffff;
		}
	}
</style>
