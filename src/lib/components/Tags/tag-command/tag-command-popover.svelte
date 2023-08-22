<script lang="ts">
	import { TagsCommand } from '.';
	import * as Popover from '$components/ui/popover';
	import type { ComponentProps } from 'svelte';

	type $$Props = ComponentProps<TagsCommand>;

	export let open = false;
    export let selectedTags: $$Props["selectedTags"] = [];
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<slot {builder}>tags</slot>
	</Popover.Trigger>
	<Popover.Content class="p-0 w-fit">
		<TagsCommand bind:open bind:selectedTags />
	</Popover.Content>
</Popover.Root>
