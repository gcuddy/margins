<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import { tick } from 'svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	import autosizeAction from '$lib/actions/autosize';
	import { noop } from '$lib/helpers';
	import { cn } from '$lib/utils/tailwind';
	let className = '';
	export let value: string | null | undefined = '';

	export { className as class };
	type $$Props = {
		class?: string;
		el?: HTMLTextAreaElement;
		onBlur?: (e: FocusEvent) => void;
		onInput?: (value: string | null | undefined) => void;
		value?: string | null;
	} & HTMLTextareaAttributes &
		VariantProps<typeof textareaVariants>;
	export let el: HTMLTextAreaElement | undefined = undefined;
	export let ref: HTMLTextAreaElement | undefined = undefined;
	$: ref = el;
	export let onInput: $$Props['onInput'] = undefined;
	export let onBlur: $$Props['onBlur'] = undefined;

	export let autosize = false;

	$: action = autosize ? autosizeAction : noop;

	export const focus = () => {
		console.log('received focus request');
		console.log({ el });
		tick().then(() => {
			el?.focus();
		});
	};

	const textareaVariants = cva(
		'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		{
			variants: {
				variant: {
					default: '',
					ghost:
						'border-none transition bg-transparent hover:ring-1 hover:ring-ring focus-visible:ring-0 focus-visible:bg-input',
					naked: 'bg-transparent border-none',
				},
			},
		},
	);

	export let variant: $$Props['variant'] = 'default';
</script>

<textarea
	bind:value
	bind:this={el}
	use:action
	class={cn(
		textareaVariants({
			class: className,
			variant,
		}),
	)}
	on:blur
	on:blur={(e) => onBlur?.(e)}
	on:input={() => onInput?.(value)}
	on:input
	on:focus
	on:click
	{...$$restProps}
/>
