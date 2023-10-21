<script lang="ts">
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from "$lib/components/ui/command";
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from "$lib/components/ui/popover";
	import { cn } from "$lib/utils/tailwind";
	import type { Placement } from "@popperjs/core";
	import { CheckCircle2, Circle, HelpCircle } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";
	import { buttonVariants } from "./ui/Button.svelte";

	const statuses = {
		Backlog: HelpCircle,
		Now: Circle,
		Archive: CheckCircle2,
	};

	export let status: keyof typeof statuses | null = null;
	export let placement: Placement = "left";
	let className = "";
	export { className as class };
	const statusValues = Object.keys(statuses) as (keyof typeof statuses)[];

	let value = "";

	// import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

	const dispatch = createEventDispatcher();
	function handleSelect(value: string) {
		dispatch("select", value);
	}
</script>

<!-- <SuperDebug data={$form} /> -->

<Popover let:close>
	<PopoverTrigger
		class={cn(
			// buttonVariants({
			// 	variant: "outline",
			// }),
			className
		)}
	>
		<slot>
			{#if status}
				<svelte:component
					this={statuses[status]}
					class="mr-2 h-4 w-4 shrink-0"
				/>
				<span>{status}</span>
			{:else}
				+ Set Status
			{/if}
		</slot>
	</PopoverTrigger>
	<PopoverContent {placement} class="p-0">
		<Command>
			<CommandInput bind:value placeholder="Change status" />
			<CommandList class="scrollbar-none">
				<CommandEmpty>No status found</CommandEmpty>
				<CommandGroup>
					{#each statusValues as _status}
						<CommandItem
							value={_status}
							onSelect={(value) => {
								handleSelect(value);
								close(null);
							}}
						>
							<svelte:component
								this={statuses[_status]}
								class="mr-2 h-4 w-4 {status === _status
									? 'opacity-100'
									: 'opacity-40'}"
							/>
							<span>{_status}</span>
						</CommandItem>
					{/each}
				</CommandGroup>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
