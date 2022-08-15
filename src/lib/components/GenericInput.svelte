<script lang="ts">
	export let placeholder = 'Enter text…';
	export let variant: 'filled' | 'ghost' = 'filled';
	let className = '';
	export { className as class };
	export let el: HTMLElement | undefined = undefined;
	export let id = '';
	export let name = '';
	export let type: 'text' | 'number' = 'text';
	export let value: string | number = type === 'text' ? '' : 0;
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
		class="h-9 w-full rounded border-0 placeholder-gray-400  transition focus:ring-0 
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: 'bg-transparent hover:ring-1 ring-gray-300 focus:bg-gray-100'}
  {className}"
		{placeholder}
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
		class="h-9 w-full rounded border-0 placeholder-gray-400  transition focus:ring-0 
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: 'bg-transparent hover:ring-1 ring-gray-300 focus:bg-gray-100'}
  {className}"
		{placeholder}
		bind:value
	/>
{/if}
