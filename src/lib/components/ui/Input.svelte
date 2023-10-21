<script lang="ts" context="module">
	export const inputVariants = cva(
		'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		{
			variants: {
				variant: {
					default: '',
					ghost: 'border-none transition bg-transparent hover:ring-1 hover:ring-ring focus-visible:ring-0 focus-visible:bg-input',
					naked: 'bg-transparent border-none'
				}
			}
		}
	);
</script>

<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils/tailwind';

	export let value: $$Props['value'] = undefined;
	export let ref: HTMLInputElement | undefined = undefined;
	let className = '';
	export { className as class };
	export let variant: $$Props['variant'] = 'default';
	type $$Props = {
		class?: string;
		onBlur?: (e: FocusEvent) => void;
		ref?: HTMLInputElement;
        value?: string | number | null | undefined;
	} & HTMLInputAttributes & VariantProps<typeof inputVariants>

    export let onBlur: $$Props['onBlur'] = undefined;


	export const focus = () => {
		ref?.focus();
	}
</script>

<input
	bind:value
	class={cn(
		inputVariants({
			class: className,
			variant
		})
	)}
	on:focus
	on:blur
	on:change
	on:keydown
	on:input
    on:blur={(e) => onBlur?.(e)}
	bind:this={ref}
	{...$$restProps}
/>
