<script lang="ts">
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuShortcut,
	} from "$lib/components/ui/dropdown-menu";
	import { cn } from "$lib/utils/tailwind";
	import type { Entry } from "@prisma/client";
	import { ListPlus, MoreVertical, RefreshCwIcon, Tag } from "lucide-svelte";
	let c = "";
	export { c as class };
	type EntryProps = Pick<Entry, "id" | "title">;
	export let entry: EntryProps;
</script>

<DropdownMenu>
	<DropdownMenuTrigger
		class={cn(
			"flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-gray-50 dark:hover:bg-gray-700",
			c
		)}
	>
		<slot>
			<MoreVertical class="stroke-muted h-4 w-4" /></slot
		>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56">
		<DropdownMenuItem>
			<Tag class="mr-2 h-4 w-4" />
			<span>Add tags</span>
			<DropdownMenuShortcut>T</DropdownMenuShortcut>
		</DropdownMenuItem>
		<DropdownMenuItem>
			<ListPlus class="mr-2 h-4 w-4" />
			<span>Add to Collection</span>
		</DropdownMenuItem>
		<DropdownMenuItem>
			<RefreshCwIcon class="mr-2 h-4 w-4" />
			<span>Re-download data</span>
		</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
