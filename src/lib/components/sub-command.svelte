<script lang="ts">
	import * as Popover from '$components/ui/popover';
	import * as Command from '$components/ui/command2';
	import { Button } from '$components/ui/button';
	import { createEventDispatcher, tick } from 'svelte';
	import { cn } from '$lib/utils';
	export let open = false;
	import type { Command as CommandType } from '$lib/types/command';

	export let inputEl: HTMLElement;

	const {
		state: { activeActions, activeValue, activeElement },
	} = Command.ctx.get();

	function handleKeydown(e: KeyboardEvent) {
        if (!_actions.length) return;
		if (e.key === 'k' && e.metaKey) {
			e.preventDefault();
			open = !open;
		}
	}

	$: console.log({ $activeActions });

	export let actions: Array<Array<CommandType>> | undefined = undefined;

	const dispatch = createEventDispatcher();

	$: _actions = actions ?? $activeActions;
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- we handle close on escape ourselves -->
{#if _actions.length}
	<Popover.Root
		closeOnEscape={false}
		closeFocus={inputEl}
		bind:open
		portal="body"
		onOpenChange={(val) => {
			if (!val) {
				tick().then(() => inputEl.focus());
			}
		}}
		positioning={{
			gutter: 16,
			placement: 'top-end',
			strategy: 'fixed',
		}}
	>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="ghost"
				size="sm"
				class={cn(
					'group flex gap-1',
					open && 'bg-accent text-accent-foreground',
				)}
				builders={[builder]}
			>
				<span>Actions</span>
				<kbd>⌘</kbd>
				<kbd>K</kbd>
			</Button>
		</Popover.Trigger>
		<Popover.Content class="p-0">
			<Command.Root>
				<Command.List>
					<Command.Group
						heading={$activeElement?.dataset.title ??
							$activeElement?.textContent ??
							undefined}
					>
						<!-- <Command.Item>Open Application</Command.Item> -->
						{#each _actions as group, index}
							{#each group as action}
								<Command.Item
									value={action.text}
									label={action.text}
									title={action.text}
									onSelect={() => {
										action.action?.();
										open = false;
										// TODO: allow maybe returning something in action to cause panel to not close?
										dispatch('close');
									}}
								>
									<svelte:component this={action.icon} class="mr-2 h-4 w-4" />
									<span>{action.text}</span>
								</Command.Item>
							{/each}
							{#if index < group.length - 1}
								<Command.Separator />
							{/if}
						{/each}
					</Command.Group>
				</Command.List>
				<Command.Input
					onKeydown={(e) => {
						if (e.key === 'Escape') {
							open = false;
						}
					}}
					showIcon={false}
					placeholder="Search for actions…"
				/>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{/if}
