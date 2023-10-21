<script lang="ts">
	import CommandGroup from '$lib/components/ui/cmdk/Command.Group.svelte';
	import { cn } from '$lib/utils/tailwind';
	import type { ComponentProps } from 'svelte';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { useState } from '../cmdk/Command.Root.svelte';

	let className = '';
	export { className as class };
	interface $$Props extends HTMLBaseAttributes, ComponentProps<CommandGroup> {
		class?: string;
	}
	const state = useState();
</script>

<CommandGroup
	{...$$restProps}
	class={cn(
		'overflow-hidden p-1 text-foreground [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:py-1.5 [&_[data-cmdk-group-heading]]:text-xs [&_[data-cmdk-group-heading]]:font-medium [&_[data-cmdk-group-heading]]:text-muted-foreground',
		className
	)}
>
	<slot search={$state.search} />
</CommandGroup>
