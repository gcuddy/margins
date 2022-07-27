<script lang="ts">
	export let value = '';
	export let placeholder = 'Enter text…';
	export let variant: 'filled' | 'ghost' = 'filled';
	let className = '';
	export { className as class };
	export let el: HTMLElement | undefined = undefined;
	export let id = '';
	export let name = '';
</script>

<input
	on:keydown
	bind:this={el}
	id={id ? id : undefined}
	name={name ? name : undefined}
	type="text"
	class="h-9 w-full rounded border-0 placeholder-gray-400  transition focus:ring-0 
  {variant === 'filled'
		? 'bg-gray-100 '
		: 'bg-transparent hover:ring-1 ring-gray-300 focus:bg-gray-100'}
  {className}"
	{placeholder}
	bind:value
/>
