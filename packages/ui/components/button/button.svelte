<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { cn } from '@margins/lib';
	import { buttonVariants, type Props, type Events } from './index.js';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ className, size, variant }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot>Button</slot>
</ButtonPrimitive.Root>
