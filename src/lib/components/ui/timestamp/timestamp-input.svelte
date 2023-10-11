<script lang="ts">
	export let duration: string;
	export let latestDuration: string | undefined = undefined;
	import { Crosshair, RotateCcw } from 'lucide-svelte';
	import Part from './timestamp-input-part.svelte';
	import { badgeVariants } from '../badge';

	const originalDuration = duration;

	export let showReset = true;

	$: durationParts = duration.split(':');

	$: newDuration = durationParts.join(':');

	export function updateDuration(newDuration: string) {
		duration = newDuration;
	}
</script>

<div class="flex">
	{#if duration}
		<div class={badgeVariants({
            variant: "outline"
        })}>
			{#each durationParts as part, index}
				<Part
					hours={index === 0 && durationParts.length === 3}
					bind:value={part}
				/><span
					>{#if index !== durationParts.length - 1}:{/if}</span
				>
			{/each}
		</div>
	{/if}
	<div class="flex ml-1 gap-1">
		{#if latestDuration && latestDuration !== newDuration}
			{@const latest = latestDuration}
			<button
				class="ml-1"
				on:click={() => {
					let parts = latest.split(':');
					durationParts = parts;
				}}
			>
				<Crosshair class="w-3 h-3 text-muted-foreground" />
			</button>
		{/if}
		<slot {updateDuration} currentTimestamp={newDuration} />
		{#if showReset && newDuration !== originalDuration}
			<button
				on:click={() => {
					let parts = originalDuration.split(':');
					durationParts = parts;
				}}
			>
				<RotateCcw class="w-3 h-3 text-muted-foreground" />
			</button>
		{/if}
	</div>
</div>
