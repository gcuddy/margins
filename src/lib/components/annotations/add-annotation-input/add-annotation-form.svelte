<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { Clock4Icon } from 'lucide-svelte';

	import { TagColorPill } from '$components/tags/tag-color';
	import { TagsCommandPopover } from '$components/tags/tag-command';
	import Badge from '$components/ui/Badge.svelte';
	import { Button } from '$components/ui/button';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { Input } from '$components/ui/input';
	import * as Tooltip from '$components/ui/tooltip';

	// export let type: 'timestamp' = 'timestamp';
	export let title = '';
	export let timestamp = '00:00:00';
	export let tags: Array<{ color: string; id: number; name: string }> = [];
	let showTimestamp = false;

	export let editor: Editor | undefined = undefined;
</script>

<div class="flex gap-2">
	<Input type="text" placeholder="Title (optional)" bind:value={title} />

	{#if showTimestamp}
		<Input
			autofocus
			type="text"
			bind:value={timestamp}
			placeholder="Timestamp"
		/>
	{:else}
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					on:click={() => {
						showTimestamp = true;
					}}
					builders={[builder]}
					variant="outline"
					class="shrink-0"
					size="icon"
				>
					<Clock4Icon class="h-5 w-5" />
					<span class="sr-only">Timestamp</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Add timestamp</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/if}
</div>
<Editor bind:this={editor} />

<TagsCommandPopover positioning={{
    placement: "bottom",
    strategy: "fixed",
}} bind:selectedTags={tags} let:builder>
	<div class="flex gap-1 flex-wrap w-fit" use:melt={builder}>
		{#each tags as tag}
			<!-- as="a" href="/tests/tag/{tag.name}" to decide: should tehse be links or trigger popover? -->
			<Badge>
				<TagColorPill invertDefault class="h-2 w-2 mr-1.5" color={tag.color} />
				{tag.name}
			</Badge>
		{:else}
			<span>+ Tag</span>
		{/each}
	</div>
</TagsCommandPopover>
<!-- <Textarea /> -->
