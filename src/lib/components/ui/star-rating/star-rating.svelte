<script lang="ts">
	import { cn } from '$lib/utils';
	import { getFormField } from 'formsnap';
	import { StarIcon, XIcon } from 'lucide-svelte';
	import { writable, type Writable } from 'svelte/store';

	export let rating = 0;

	let hovering: number[] = [];

	export let disabled = false;

	let className: string | null | undefined = undefined;
	export { className as class };

    export let preventDefault = false;
    export let form = false;

    let valueStore = writable(0);

    if (form) {
        const { value } = getFormField();
        valueStore = value as Writable<number>;
        if (valueStore && $valueStore) {
            rating = $valueStore;
        }
    }

	$: highestHovering = Math.max(...hovering);

	function handleRating(value: number) {
		console.log({ value });
		rating = value;
        if (valueStore) {
            valueStore.set(value);
        }
	}

	let activeValue = 1;
    let container: HTMLElement;


</script>

<div bind:this={container} role="group" class="flex items-center group" aria-label="Rating">
	{#each [1, 2, 3, 4, 5] as value}
		<button
			{disabled}
			name="rating"
			{value}
            data-star-value={value}
			on:click={(e) => {
                if (preventDefault) {
                    e.preventDefault();
                }
                handleRating(value);
            }}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					handleRating(value);
                    return;
				}
                if (e.key === 'ArrowLeft') {
                    const prevValue = Math.max(1, value - 1);
                    const prev = container.querySelector(`[data-star-value="${prevValue}"]`);
                    if (prev && prev instanceof HTMLElement) {
                        prev.focus();
                    }
                    // activeValue = Math.max(1, value - 1);
                    return;
                }
                if (e.key === 'ArrowRight') {
                    const nextValue = Math.min(5, value + 1);
                    const next = container.querySelector(`[data-star-value="${nextValue}"]`);
                    if (next && next instanceof HTMLElement) {
                        next.focus();
                    }
                    // activeValue = Math.min(5, value + 1);
                    return;
                }
			}}
			on:mouseover={() => {
				hovering = [...hovering, value];
			}}
			on:mouseleave={() => {
				hovering = hovering.filter((v) => v !== value);
			}}
			on:focus={() => {
                activeValue = value;
				hovering = [...hovering, value];
			}}
			on:blur={() => {
				hovering = hovering.filter((v) => v !== value);
			}}
			tabindex={activeValue === value ? 0 : -1}
			role="button"
			aria-label={`Rate ${value} stars`}
		>
			<!-- {rating >= value - 0.5 ? '★' : '☆'} -->
			<!-- <input type="hidden" name="rating" value={value} /> -->
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
