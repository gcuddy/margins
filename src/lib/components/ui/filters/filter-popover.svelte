<script lang="ts">
	import * as Popover from '$components/ui/popover';
	import * as Command from '$components/ui/command2';
	import { cn } from '$lib';
	import { badgeVariants } from '../badge';
	import { melt } from '@melt-ui/svelte';
	import type { CommandProps } from '../command2/store';

	export let open = false;

    type T = $$Generic;

	const close = () => {
		open = false;
	};

    export let multiple = false;

    export let selectedValue: CommandProps<T>['selectedValue'] = undefined;
</script>

<Popover.Root bind:open>
	<Popover.Trigger let:builder asChild>
		<button
			use:melt={builder}
			class={cn(
				badgeVariants({ variant: 'outline' }),
				'rounded-none min-w-0 border-l-0 border-r cursor-pointer  truncate',
			)}
		>
			<slot name="trigger" />
		</button>
	</Popover.Trigger>
	<Popover.Content class="p-0 w-[200px]">
		<Command.Root {multiple} {selectedValue}>
			<Command.Input></Command.Input>
			<Command.List>
				<slot name="commands" {close} />
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
