<script lang="ts">
	import { CheckCircle2, Circle, HelpCircle } from "lucide-svelte";
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
	import type { Bookmark, Entry } from "@prisma/client";
	import { buttonVariants } from "./ui/Button.svelte";
	import type { UpdateBookmarkSchema } from "$lib/features/entries/forms";
	import { cn } from "$lib/utils/tailwind";
	import type { Validation } from "sveltekit-superforms";
	import { superForm } from "sveltekit-superforms/client";

	export let entry: Pick<Entry, "id"> & {
		bookmark?: Pick<Bookmark, "id" | "status">;
	};
	export let data: Validation<UpdateBookmarkSchema>;
	export let action_prefix = `/tests/entry/${entry.id}`;

	const statuses = {
		Backlog: HelpCircle,
		Now: Circle,
		Archive: CheckCircle2,
	};
	const statusValues = Object.keys(statuses) as (keyof typeof statuses)[];

	const { form, enhance } = superForm(data, {
		dataType: "json",
		onSubmit: (data) => {
			console.log("submit", data);
		},
	});

	let value = "";

	let formEl: HTMLFormElement;

	// import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

	function handleSelect(value: string) {
		$form.status = value as keyof typeof statuses;
		formEl?.requestSubmit();
	}
</script>

<!-- <SuperDebug data={$form} /> -->

<form
	class=""
	bind:this={formEl}
	use:enhance
	method="post"
	action="{action_prefix}?/updateBookmark"
>
	<Popover let:close>
		<PopoverTrigger
			class={cn(
				buttonVariants({
					variant: "outline",
					size: "xs",
				}),
				"w-[100px]"
			)}
		>
			{#if $form.status}
				<svelte:component
					this={statuses[$form.status]}
					class="mr-2 h-4 w-4 shrink-0"
				/>
				<span>{$form.status}</span>
			{:else}
				+ Set Status
			{/if}
		</PopoverTrigger>
		<PopoverContent class="p-0">
			<Command>
				<CommandInput bind:value placeholder="Change status" />
				<CommandList class="scrollbar-none">
					<CommandEmpty>No status found</CommandEmpty>
					<CommandGroup>
						{#each statusValues as status}
							<CommandItem
								value={status}
								onSelect={(value) => {
									handleSelect(value);
									close(null);
								}}
							>
								<svelte:component
									this={statuses[status]}
									class="mr-2 h-4 w-4 {status === entry.bookmark?.status
										? 'opacity-100'
										: 'opacity-40'}"
								/>
								<span>{status}</span>
							</CommandItem>
						{/each}
					</CommandGroup>
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>
</form>
