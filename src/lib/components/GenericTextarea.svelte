<script lang="ts">
	export let value = '';
	export let placeholder = 'Enter text…';
	export let variant: 'filled' | 'ghost' | 'naked' = 'filled';
	let className = '';
	export { className as class };
	export let el: HTMLElement | undefined = undefined;
	export let id = '';
	export let name = '';
	export let rows = 2;
</script>

<div class="grid" data-replicated-value={value}>
	<textarea
		on:keydown
		on:focus
		on:blur
		{rows}
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="text"
		class="w-full resize-none overflow-hidden rounded border-0 placeholder-gray-400  transition focus:ring-0 dark:placeholder-gray-500
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: variant === 'ghost'
			? 'bg-transparent hover:ring-1 ring-gray-300 focus:bg-gray-100 dark:focus:bg-gray-700 dark:ring-gray-700'
			: 'bg-transparent'}
  {className}"
		{placeholder}
		bind:value
	/>
</div>

<style>
	div::after {
		/* Note the weird space! Needed to preventy jumpy behavior */
		content: attr(data-replicated-value) ' ';
		/* This is how textarea text behaves */
		white-space: pre-wrap;

		/* Hidden from view, clicks, and screen readers */
		visibility: hidden;
	}
	textarea,
	div::after {
		/* Place on top of each other */
		grid-area: 1 / 1 / 2 / 2;
	}
</style>
