<script lang="ts">
	// value from 0 to 1
	export let value: number;
	export let min: number;
	export let max: number;
	let className = 'bg-gray-500';
	export { className as class };
	export let innerClass = 'bg-blue-500';
</script>

	<div
		on:click
		role="progressbar"
		class="relative overflow-hidden {className}"
		aria-valuenow={value}
		aria-valuemin={min}
		aria-valuemax={max}
	>
		<inner
			class="h-full will-change-transform {innerClass}"
			style="--progress-amount: {(value / max) * 100 + `%`}"
		/>
	</div>

<style lang="postcss">
	inner {
		clip-path: polygon(0% 0%, var(--progress-amount) 0%, var(--progress-amount) 100%, 0% 100%);
		transition: clip-path 0.25s ease-in-out;
		display: block;
	}
</style>
