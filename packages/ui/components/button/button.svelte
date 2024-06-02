<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { cn } from '@margins/lib';
	import { buttonVariants, type Props, type Events } from './index.js';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'solid';
	export let size: $$Props['size'] = 'md';
	export let builders: $$Props['builders'] = [];
	export let color: $$Props['color'] = undefined;
	export let disabled: boolean | null | undefined = undefined;
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(
		buttonVariants({ color: color ?? undefined, className, size, variant }),
	)}
	data-variant={variant}
	data-size={size}
	data-disabled={disabled}
	{disabled}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot>Button</slot>
</ButtonPrimitive.Root>
