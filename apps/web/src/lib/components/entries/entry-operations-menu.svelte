<script lang="ts">
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { Button } from '$components/ui/button';
	import { DotsHorizontal } from 'radix-icons-svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { entryCommands, type Entry } from './operations';
	const queryClient = useQueryClient();
	export let entry: Entry;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon">
			<DotsHorizontal />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			{#each entryCommands(queryClient) as { text, icon, action }}
				<DropdownMenu.Item
					on:click={() => {
						action?.(entry);
					}}
				>
					<svelte:component this={icon} class="mr-2 h-4 w-4" />
					{text}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
