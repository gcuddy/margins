<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { mainCommandState } from './stores/command-state';
	import { Command } from '@margins/ui';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { setMode } from 'mode-watcher';
	import Navigation from './commands/navigation.commands.svelte';
	// import { createState } from "cmdk-sv";

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			if ($mainCommandState.open) {
				$mainCommandState.open = false;
				mainCommandState.reset();
			} else {
				$mainCommandState.open = true;
			}
		}
		if ($mainCommandState.open && e.key === 'Escape') {
			e.preventDefault();
			$mainCommandState.open = false;
			mainCommandState.reset();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const {
		containerEl,
		createPlaceholder,
		currentMenu,
		registeredActions,
		registeredComponents,
	} = mainCommandState;

	const placeholder = createPlaceholder('Type a command or search');
</script>

<Command.Dialog
	bind:el={$containerEl}
	bind:open={$mainCommandState.open}
	onOpenChange={(open) => {
		console.log('open', open);
		if (!open) {
			tick().then(() => {
				console.log('resetting ');
				mainCommandState.reset();
			});
		}
	}}
>
	<Command.Input
		bind:value={$mainCommandState.input}
		placeholder={$placeholder}
	/>
	<Command.List>
		{#if !$currentMenu}
			<Command.Empty>No results found.</Command.Empty>
			{#if $registeredActions.length}
				<!-- TODO: heading -->
				<Command.Group>
					{#each $registeredActions as action}
						<Command.Item
							value={action.label}
							onSelect={() => mainCommandState.run(action.action)}
						>
							{action.label}
						</Command.Item>
					{/each}
				</Command.Group>
			{/if}
			{#if $registeredComponents.length}
				<Command.Group>
					{#each $registeredComponents as { component, props }}
						<svelte:component this={component} {...props} />
					{/each}
				</Command.Group>
			{/if}
			<Command.Group heading="Theme">
				<Command.Item
					value="light"
					onSelect={() => mainCommandState.run(() => setMode('light'))}
				>
					<Sun class="mr-2 h-4 w-4" />
					Light
				</Command.Item>
				<Command.Item
					value="dark"
					onSelect={() => mainCommandState.run(() => setMode('dark'))}
				>
					<Moon class="mr-2 h-4 w-4" />
					Dark
				</Command.Item>
				<!-- <Command.Item value="system" onSelect={() => runCommand(() => resetMode())}>
				<Laptop class="mr-2 h-4 w-4" />
				System
			</Command.Item> -->
			</Command.Group>
			<Command.Group heading="Navigation">
				<Navigation />
			</Command.Group>
		{:else}
			<svelte:component
				this={$currentMenu.content}
				{...$currentMenu.contentProps}
			/>
		{/if}
	</Command.List>
</Command.Dialog>
