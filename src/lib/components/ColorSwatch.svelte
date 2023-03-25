<script lang="ts">
	export let hex: string = "";
	export let selected = false;
	let c = "";
	export { c as class };
	export let checkmark = true;
	export let hover = true;
	export let as: keyof HTMLElementTagNameMap = "button";
</script>

<svelte:element
	this={as}
	on:click
	on:keydown
	class="group inline-flex focus-visible:outline-none {c}"
>
	<div
		style:--swatch={hex}
		style:--size="var(--swatchSize,18px)"
		color={hex}
		class="flex h-[var(--size)] w-[var(--size)] rounded-full p-0.5"
	>
		<div
			style:height="calc(var(--size) - 4px)"
			style:width="calc(var(--size) - 4px)"
			data-selected={checkmark ? selected : undefined}
			class=" rounded-full bg-[var(--swatch)] shadow-[var(--swatch)] ring-[var(--swatch)] ring-offset-1 ring-offset-gray-900 group-focus:shadow group-focus:ring-1 {hover
				? 'hover:shadow hover:ring-1'
				: ''} {selected ? '' : ''}"
		/>
	</div>
</svelte:element>

<style>
	[data-selected="true"] {
		background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
	}
</style>
