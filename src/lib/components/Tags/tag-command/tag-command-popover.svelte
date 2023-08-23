<script lang="ts">
	import { TagsCommand } from '.';
	import * as Popover from '$components/ui/popover';
	import type { ComponentProps } from 'svelte';
	import type { PopoverProps } from 'bits-ui/dist/bits/popover';

	type $$Props = ComponentProps<TagsCommand> & {
        onOpenChange?: PopoverProps['onOpenChange'];
    }

	export let onOpenChange: $$Props["onOpenChange"]= undefined;

	export let open = false;
	export let selectedTags: $$Props['selectedTags'] = [];
</script>

<Popover.Root bind:open {onOpenChange}>
	<Popover.Trigger asChild let:builder>
		<slot {builder}>tags</slot>
	</Popover.Trigger>
	<Popover.Content class="p-0 w-fit">
		<TagsCommand bind:open bind:selectedTags />
	</Popover.Content>
</Popover.Root>
