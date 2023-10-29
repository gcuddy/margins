<script lang="ts">
	import type { PopoverProps } from 'bits-ui/dist/bits/popover';
	import type { ComponentProps } from 'svelte';

	import * as Popover from '$components/ui/popover';

	import { TagsCommand } from '.';

	type $$Props = ComponentProps<TagsCommand> & {
        onOpenChange?: PopoverProps['onOpenChange'];
        positioning?: PopoverProps['positioning'];
    }

	export let onOpenChange: $$Props["onOpenChange"]= undefined;

	export let open = false;
	export let selectedTags: $$Props['selectedTags'] = [];

    export let positioning: $$Props['positioning'] = undefined;
</script>

<Popover.Root bind:open {positioning} {onOpenChange}>
	<Popover.Trigger asChild let:builder>
		<slot {builder}>tags</slot>
	</Popover.Trigger>
	<Popover.Content class="p-0 w-fit">
		<TagsCommand on:select bind:open bind:selectedTags />
	</Popover.Content>
</Popover.Root>
