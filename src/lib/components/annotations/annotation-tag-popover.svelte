<script lang="ts">
	import TagCommandItems from '$components/tags/tag-command/tag-command-items.svelte';
	import * as Command from '$components/ui/command2';
	import * as Popover from '$components/ui/popover';

	export let annotationId: string;
	export let open = false;

	// If set to false, the trigger will not be shown (useful for when the popover is triggered outside)
	export let showTrigger = true;
</script>

<Popover.Root bind:open>
	{#if showTrigger}
		<Popover.Trigger asChild let:builder>
			<slot {builder}>tags</slot>
		</Popover.Trigger>
	{/if}
	<Popover.Content class="p-0 w-fit">
		<Command.Root shouldFilter={false}>
			<Command.Input />
			<Command.List>
				<Command.Group>
					<!-- Command Items -->
					<TagCommandItems />
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
