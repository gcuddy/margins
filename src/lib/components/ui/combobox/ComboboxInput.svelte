<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { CreateCombobox } from './utils';

	export let input: CreateCombobox['input'];
	export let inputValue: CreateCombobox['inputValue'];
	export let placeholder: string | undefined = undefined;
	let className = '';
	export { className as class };
</script>

<input
	{...$input}
	use:input
	class={cn(
		'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{placeholder}
	value={$inputValue}
	{...$$restProps}
/>
