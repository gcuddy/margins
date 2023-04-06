<script lang="ts">
	import CommandInput from "$lib/components/ui/cmdk/Command.Input.svelte";
	import CommandEmpty from "$lib/components/ui/cmdk/Command.Empty.svelte";
	import CommandList from "$lib/components/ui/cmdk/Command.List.svelte";
	import CommandGroup from "$lib/components/ui/cmdk/Command.Group.svelte";
	import CommandItem from "$lib/components/ui/cmdk/Command.Item.svelte";
	import CommandSeparator from "$lib/components/ui/cmdk/Command.Separator.svelte";
	import { Dialog, DialogContent } from "$lib/components/ui/dialog";
	import type { ComponentProps } from "svelte";
	import Command from "$lib/components/ui/command/Command.svelte";
	interface $$Props extends ComponentProps<Dialog> {}
</script>

<Dialog {...$$props}>
	<DialogContent
		class="overflow-hidden p-0 shadow-2xl [&_[dialog-overlay]]:bg-red-100"
	>
		<!-- s -->
		<Command
			class="[&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:font-medium [&_[data-cmdk-group-heading]]:text-gray-500 [&_[data-cmdk-group]:not([hidden])_~[data-cmdk-group]]:pt-0 [&_[data-cmdk-group]]:px-2 [&_[data-cmdk-input-wrapper]_svg]:h-5 [&_[data-cmdk-input-wrapper]_svg]:w-5 [&_[data-cmdk-input]]:h-12 [&_[data-cmdk-item]]:px-2 [&_[data-cmdk-item]]:py-3 [&_[data-cmdk-item]_svg]:h-5 [&_[data-cmdk-item]_svg]:w-5"
		>
			<!-- slot -->
			<slot />
		</Command>
	</DialogContent>
	<!-- s -->
</Dialog>
