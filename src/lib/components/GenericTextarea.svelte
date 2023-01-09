<script lang="ts">
	import autosize from '$lib/actions/autosize';

	export let value = '';
	export let placeholder = 'Enter text…';
	export let variant: 'filled' | 'ghost' | 'naked' = 'filled';
	let className = '';
	export { className as class };
	export let el: HTMLElement | undefined = undefined;
	export let id = '';
	export let name = '';
	export let rows = 2;
	export let maxRows = 50;

	$: minHeight = `${1 + rows * 1.2}em`;
	$: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`;
</script>

<textarea
	use:autosize
	on:keydown
	on:focus
	on:blur
	{rows}
	bind:this={el}
	id={id ? id : undefined}
	name={name ? name : undefined}
	class="w-full resize-none overflow-hidden rounded border-0 placeholder-gray-400  transition focus:ring-0 dark:placeholder-gray-500
  {variant === 'filled'
		? 'bg-gray-100 dark:bg-gray-700'
		: variant === 'ghost'
		? 'bg-transparent ring-gray-300 hover:ring-1 focus:bg-gray-100 dark:ring-gray-700 dark:focus:bg-gray-700'
		: 'bg-transparent'}
  {className}"
	{placeholder}
	bind:value
/>

<style>
</style>
