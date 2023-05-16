<script lang="ts">
	import Command from "$lib/components/ui/command/Command.svelte";
	import { Dialog, DialogContent } from "$lib/components/ui/dialog";
	import type { ComponentProps } from "svelte";
	export let isOpen = false;
	export let onKeydown: ComponentProps<Command>["onKeydown"] = undefined;
	export let shouldFilter: ComponentProps<Command>["shouldFilter"] = undefined;
	interface $$Props extends ComponentProps<Dialog> {
		isOpen?: boolean;
		onKeydown?: ComponentProps<Command>["onKeydown"];
		shouldFilter?: ComponentProps<Command>["shouldFilter"];
		filter?: ComponentProps<Command>["filter"];	
	}
</script>

<Dialog bind:isOpen {...$$restProps}>
	<DialogContent
		class="overflow-hidden p-0 shadow-2xl [&_[dialog-overlay]]:bg-red-100"
	>
		<!-- s -->
		<Command
			on:close
			{onKeydown}
			{shouldFilter}
			class="[&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:font-medium [&_[data-cmdk-group-heading]]:text-muted-foreground [&_[data-cmdk-group]:not([hidden])_~[data-cmdk-group]]:pt-0 [&_[data-cmdk-group]]:px-2 [&_[data-cmdk-input-wrapper]_svg]:h-5 [&_[data-cmdk-input-wrapper]_svg]:w-5 [&_[data-cmdk-input]]:h-12 [&_[data-cmdk-item]]:px-2 [&_[data-cmdk-item]]:py-3 [&_[data-cmdk-item]_svg]:h-5 [&_[data-cmdk-item]_svg]:w-5"
		>
			<!-- slot -->
			<slot />
		</Command>
	</DialogContent>
	<!-- s -->
</Dialog>
