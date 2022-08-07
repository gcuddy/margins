<script lang="ts">
	export let type: 'submit' | 'reset' | 'button' = 'button';
	export let disabled: boolean = false;
	export let className = '';

	export let variant: 'primary' | 'ghost' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';

	/** whether or not to style on hover */
	export let hover = true;

	// TODO: tooltips
</script>

<button
	{type}
	{disabled}
	on:click
	class="relative flex h-7 shrink-0 cursor-default select-none appearance-none items-center justify-center truncate rounded px-2 font-medium shadow-sm focus-visible:ring disabled:opacity-60 
  {size === 'md' ? 'text-sm' : size === 'sm' ? 'text-xs' : 'text-base'}  
    {variant === 'ghost'
		? 'border border-gray-300 bg-white dark:bg-gray-700 text-gray-600 hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-300  dark:hover:text-gray-200'
		: 'bg-amber-700 text-amber-50'}
{className}"
>
	<slot>Button</slot>
</button>
