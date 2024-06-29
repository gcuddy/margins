<script lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';
	import { cn } from '@margins/lib';
	import { panel } from '../../styles/tailwind.js';
	import { baseMenu } from '../base-menu.js';

	type $$Props = CommandPrimitive.CommandProps;

	export let value: $$Props['value'] = undefined;

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<CommandPrimitive.Root
	class={cn(
		baseMenu({
			size: "lg"
		}),
		'flex h-full w-full flex-col overflow-hidden rounded-md',
		className,
	)}
	bind:value
	{...$$restProps}
>
	<slot />
</CommandPrimitive.Root>
