<script lang="ts">
	type T = $$Generic;
	export let value: T;
	let className = '';
	export { className as class };

	export let as = 'div';
</script>

<div class="relative w-max">
	<select bind:value>
		<slot />
	</select>
	<svelte:element this={as} class={className}>
		<slot name="label" {value}>
			{value}
		</slot>
	</svelte:element>
</div>

<style lang="postcss">
	select {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
</style>
