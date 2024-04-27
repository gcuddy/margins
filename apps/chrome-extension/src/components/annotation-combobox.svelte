<script lang="ts">
	import { Command, Popover } from '@margins/ui';
	import type { Command as TCommand } from '@margins/features/commands';
	export let open = false;
	export let value = '';
	export let placeholder = 'What do you want to do?';

	export let commands: TCommand[] = [];
</script>

<Popover.Root bind:open>
	<Popover.Content side="bottom" align="start" class="w-[200px] p-0">
		<Command.Root shouldFilter={false}>
			<Command.Input bind:value {placeholder} />
			<Command.Group>
				{#each commands as command}
					<Command.Item
						onSelect={() => {
							command.action();
							open = false;
						}}
					>
						<Command.Icon icon={command.icon} />
						{command.label}</Command.Item
					>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
