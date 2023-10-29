<script lang="ts">
	import type { Bookmark, Entry } from "@prisma/client";
	import { CheckCircle2, Circle, HelpCircle } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import type { SuperValidated } from "sveltekit-superforms";
	import { superForm } from "sveltekit-superforms/client";

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
	import type { UpdateBookmarkSchema } from "$lib/features/entries/forms";
	import { invalidated, update_entry } from "$lib/state/entries";
	import type { Message } from "$lib/types";
	import { cn } from "$lib/utils/tailwind";

	import { buttonVariants } from "./ui/Button.svelte";

	export let entry: Pick<Entry, "id"> & {
		bookmark?: Pick<Bookmark, "id" | "status"> | null;
	};
	export let data: SuperValidated<UpdateBookmarkSchema, Message>;
	export let action_prefix = `/entry/${entry.id}`;

	const statuses = {
		Archive: CheckCircle2,
		Backlog: HelpCircle,
		Now: Circle,
	};
	const statusValues = Object.keys(statuses) as Array<keyof typeof statuses>;
	const { enhance, form, message } = superForm(data, {
		dataType: "json",
		onResult: (data) => {
			if (data.result.type === 'success') {
				invalidated.set(true)
				update_entry(entry.id, {
					status: $form.status
				});
			}
		},
		onSubmit: (data) => {
			console.log("submit", data);
		}
		// onResult({ result }) {
		// 	toast($message?.text || "Updated bookmark");
		// },
	});

	let value = "";

	let formEl: HTMLFormElement;

	// import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

	function handleSelect(value: string) {
		$form.status = value as keyof typeof statuses;
		formEl.requestSubmit();
	}

	$: if ($message?.status === "success") {
		toast.success($message.text);
		// queryClient.invalidateQueries({
		// 	queryKey: queryKeys.entries.library._def
		// })
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
	<Popover>
		<PopoverTrigger
			class={cn(
				buttonVariants({
					size: 'xs',
					variant: "outline"
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
				Save
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
