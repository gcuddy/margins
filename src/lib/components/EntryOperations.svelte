<script lang="ts">
	import { page } from "$app/stores";
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuShortcut,
	} from "$lib/components/ui/dropdown-menu";
	import { addEntriesToCollection } from "$lib/features/collections/stores";

	import { cn } from "$lib/utils/tailwind";
	import type { Entry } from "@prisma/client";
	import { ListPlus, MoreVertical, RefreshCwIcon, Tag } from "lucide-svelte";
	import toast from "svelte-french-toast";
	let c = "";
	export { c as class };
	type EntryProps = Pick<Entry, "id">;
	export let entry: EntryProps;

	const client = trpc($page);
	const utils = client.createContext();

	async function refreshData() {
		const data = new FormData();
		data.append("id", String(entry.id));
		const response = await fetch(
			`/u:${$page.data.user?.username}/entry/${entry.id}?/refreshData`,
			{
				method: "POST",
				body: data,
				headers: {
					"x-sveltekit-action": "true",
				},
			}
		);
		if (response.ok) {
			toast.success("Data refreshed");
			utils.entries.invalidate();
		} else {
			toast.error("Failed to refresh data");
		}
	}

	const refreshMutation = client.entries.refreshData.createMutation({
		onSuccess: () => {
			utils.entries.invalidate();
		},
	});

	// TODO
</script>

<DropdownMenu>
	<DropdownMenuTrigger
		class={cn(
			"flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700",
			c
		)}
	>
		<slot>
			<MoreVertical class="h-4 w-4 stroke-muted" /></slot
		>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56">
		<DropdownMenuItem>
			<Tag class="mr-2 h-4 w-4" />
			<span>Add tags</span>
			<DropdownMenuShortcut>T</DropdownMenuShortcut>
		</DropdownMenuItem>
		<DropdownMenuItem
			on:click={() => {
				addEntriesToCollection([entry.id], (c) => {
					utils.entries.invalidate();
					utils.collections.invalidate();
				});
			}}
		>
			<ListPlus class="mr-2 h-4 w-4" />
			<span>Add to Collection</span>
		</DropdownMenuItem>
		<DropdownMenuItem on:click={refreshData}>
			<RefreshCwIcon class="mr-2 h-4 w-4" />
			<span>Re-download data</span>
		</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
