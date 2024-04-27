<script lang="ts">
	import Command from './command.svelte';
	import CommandInput from './command-input.svelte';
	import CommandGroup from './command-group.svelte';
	import CommandList from './command-list.svelte';
	import CommandItem from './command-item.svelte';
	import CommandIcon from './command-icon.svelte';
	import type { Command as TCommand } from '@margins/features/commands';
	export let open = false;
	export let value = '';
	export let placeholder = 'What do you want to do?';
	export let shouldFilter = true;
	export let autofocus = false;

	export let commands: TCommand[] = [];
</script>

<Command {shouldFilter}>
	<CommandInput {autofocus} bind:value {placeholder} />
	<CommandList>
		<slot>
			<CommandGroup>
				{#each commands as command}
					<CommandItem
						onSelect={() => {
							command.action();
							open = false;
						}}
					>
						<CommandIcon icon={command.icon} />
						{command.label}</CommandItem
					>
				{/each}
			</CommandGroup>
		</slot>
	</CommandList>
</Command>
