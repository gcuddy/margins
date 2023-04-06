<script lang="ts">
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator,
		CommandShortcut,
	} from "$lib/components/ui/command";
	import {
		Calculator,
		Calendar,
		CreditCard,
		Settings,
		Smile,
		User,
	} from "lucide-svelte";
	import { writable } from "svelte/store";
	const open = writable(false);
	const search = writable("");
	const pages = writable<string[]>([]);
	$: page = $pages[$pages.length - 1];
	$: page, search.set("");
</script>

<Command
	onKeydown={(e) => {
		console.log("custom", e.key, $search);
		if (e.key === "Escape" || (e.key === "Backspace" && !$search)) {
			e.preventDefault();
			$pages = $pages.slice(0, -1);
		}
	}}
	class="rounded-lg border border-slate-100  shadow-md dark:border-slate-800"
>
	<CommandInput
		bind:value={$search}
		placeholder="Type a command or search..."
	/>
	<CommandList>
		<CommandEmpty>No results found.</CommandEmpty>
		{#if !page}
			<CommandItem onSelect={() => ($pages = [...$pages, "projects"])}
				>Search projects…</CommandItem
			>
			<CommandItem onSelect={() => ($pages = [...$pages, "teams"])}
				>Join a team…</CommandItem
			>
		{/if}
		{#if page === "projects"}
			<CommandItem>Project A</CommandItem>
			<CommandItem>Project B</CommandItem>
		{/if}
		{#if page === "teams"}
			<CommandItem>Team 1</CommandItem>
			<CommandItem>Team 2</CommandItem>
		{/if}
	</CommandList>
</Command>
