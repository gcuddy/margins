<script lang="ts">
	import Annotation from './Annotation.svelte';

	export let placeholder = 'Enter text…';
	export let variant: 'filled' | 'ghost' | 'underline' = 'filled';
	let className = '';
	export { className as class };
	export let el: HTMLElement | undefined = undefined;
	export let id = '';
	export let name = '';
	export let type: 'text' | 'number' | 'password' | 'email' = 'text';
	export let value: string | number = type === 'number' ? 0 : '';
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let autocomplete: string | undefined = undefined;
</script>

{#if type === 'text'}
	<input
		on:keydown
		on:focus
		on:blur
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="text"
		class="h-9 w-full rounded-lg border-0 placeholder-gray-400 transition focus:ring-0
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: variant === 'underline'
			? 'bg-transparent border-b rounded-none border-gray-300 dark:border-gray-600 focus:border-amber-300'
			: 'bg-transparent hover:ring-1 ring-gray-300 focus:bg-gray-100'}
  {className}"
		{placeholder}
		{autocomplete}
		{...$$restProps}
		bind:value
	/>
{:else if type === 'email'}
	<input
		on:keydown
		on:focus
		on:blur
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="email"
		class="h-9 w-full rounded-lg border-0 placeholder-gray-400 transition focus:ring-0
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: variant === 'underline'
			? 'bg-transparent border-b rounded-none border-gray-300 dark:border-gray-600 focus:border-amber-300'
			: 'bg-transparent hover:ring-1 ring-gray-300 focus:bg-gray-100'}
  {className}"
		{placeholder}
		{autocomplete}
		{...$$restProps}
		bind:value
	/>
{:else if type === 'number'}
	<input
		on:keydown
		on:focus
		on:blur
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="number"
		class="h-9 w-full rounded-lg border-0 placeholder-gray-400  transition focus:ring-0
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: 'bg-transparent hover:ring-1 ring-gray-300 focus:bg-gray-100'}
  {className}"
		{placeholder}
		{autocomplete}
		{...$$restProps}
		{min}
		{max}
		bind:value
	/>
{:else if type === 'password'}
	<input
		on:keydown
		on:focus
		on:blur
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="password"
		class="h-9 w-full rounded-lg border-0 placeholder-gray-400  transition focus:ring-0
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: 'bg-transparent hover:ring-1 ring-gray-300 focus:bg-gray-100'}
  {className}"
		{placeholder}
		{autocomplete}
		{...$$restProps}
		{min}
		{max}
		bind:value
	/>
{/if}
