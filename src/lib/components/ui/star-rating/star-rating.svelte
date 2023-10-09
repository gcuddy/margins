<script lang="ts">
	import { cn } from '$lib/utils';
	import { StarIcon, XIcon } from 'lucide-svelte';

	export let rating = 0;

	let hovering: number[] = [];

	export let disabled = false;

	let className: string | null | undefined = undefined;
	export { className as class };

	$: console.log({ hovering });

	$: highestHovering = Math.max(...hovering);

	function handleRating(value: number) {
		rating = value;
	}
</script>

<div role="group" class="flex items-center group" aria-label="Rating">
	{#each [1, 2, 3, 4, 5] as value}
		<button
			{disabled}
			name="rating"
			{value}
			on:click={() => handleRating(value)}
			on:keydown={(e) => e.key === 'Enter' && handleRating(value)}
			on:mouseover={() => {
				hovering = [...hovering, value];
			}}
			on:mouseleave={() => {
				hovering = hovering.filter((v) => v !== value);
			}}
			on:focus={() => {
				hovering = [...hovering, value];
			}}
			on:blur={() => {
				hovering = hovering.filter((v) => v !== value);
			}}
			tabindex="0"
			role="button"
			aria-label={`Rate ${value} ${rating === value ? 'stars' : 'half star'}`}
		>
			<!-- {rating >= value - 0.5 ? '★' : '☆'} -->
			<StarIcon
				class={cn(
					'w-5 h-5',
					rating >= value
						? 'fill-primary stroke-primary'
						: 'fill-secondary stroke-secondary',
					!disabled &&
						hovering.length &&
						value <= highestHovering &&
						'fill-blue-400 stroke-blue-400',
					className,
				)}
			/>
		</button>
	{/each}
	{#if !disabled && rating}
		<button
			class="group-hover:opacity-100 transition-opacity opacity-0 ml-1"
			value={0}
			name="rating"
			on:click={() => handleRating(0)}
		>
			<XIcon class="w-4 h-4" />
		</button>
	{/if}
</div>

<style>
	/* Your preferred styling here, maybe use Tailwind */
</style>
