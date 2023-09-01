<script lang="ts">
	import { Command } from '$components/ui/command2';

	import { Dialog, DialogContent } from '../dialog';

	// type $$Props = ComponentProps<typeof Dialog>;
    export let open = false;
    export let shouldFilter = false;
</script>

<Dialog bind:open {...$$restProps}>
	<DialogContent class="overflow-hidden p-0 shadow-lg">
		<Command
            bind:shouldFilter
			class="[&_[data-command-group-heading]]:px-2 [&_[data-command-group-heading]]:font-medium [&_[data-command-group-heading]]:text-muted-foreground [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-group]]:px-2 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5"
		>
			<slot />
		</Command>
	</DialogContent>
</Dialog>
