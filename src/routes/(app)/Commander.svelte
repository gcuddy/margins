<script lang="ts">
	import {
		Calculator,
		Calendar,
		Cog,
		CreditCard,
		Settings,
		Smile,
		User,
	} from "lucide-svelte";
	import {
		Command,
		CommandDialog,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator,
		CommandShortcut,
	} from "$lib/components/ui/command";
	import { writable } from "svelte/store";

	import { page as spage } from "$app/stores";

	let isOpen = false;

	const search = writable("");
	const pages = writable<string[]>([]);
	$: page = $pages[$pages.length - 1];
	$: page, search.set("");

	$: if (!isOpen) {
		$pages = [];
	}
</script>

<svelte:window
	on:keydown={(e) => {
		// listen for command + j
		if (e.metaKey && e.key === "j") {
			isOpen = true;
		}
	}}
/>

<slot />

<!-- class="rounded-lg border border-gray-100  shadow-md  dark:border-gray-800" -->
<CommandDialog
	bind:isOpen
	onKeydown={(e) => {
		console.log("custom", e.key, $search);
		if (e.key === "Escape" || (e.key === "Backspace" && !$search)) {
			e.preventDefault();
			$pages = $pages.slice(0, -1);
		}
	}}
>
	<CommandInput
		bind:value={$search}
		placeholder="Type a command or search..."
	/>
	<CommandList class="scrollbar-hide">
		<CommandEmpty>No results found.</CommandEmpty>
		{#if !page}
			<CommandGroup heading="Suggestions">
				<CommandItem>
					<Calendar class="mr-2 h-4 w-4" />
					<span>Calendar</span>
				</CommandItem>
				<CommandItem>
					<Smile class="mr-2 h-4 w-4" />
					<span>Search Emoji</span>
				</CommandItem>
				<CommandItem>
					<Calculator class="mr-2 h-4 w-4" />
					<span>Calculator</span>
				</CommandItem>
			</CommandGroup>
			<CommandSeparator />
			<CommandGroup heading="Settings">
				<CommandItem onSelect={() => ($pages = [...$pages, "theme"])}>
					<Cog class="mr-2 h-4 w-4" />
					<span>Change theme</span>
					<!-- <CommandShortcut>⌘P</CommandShortcut> -->
				</CommandItem>
				<CommandItem>
					<CreditCard class="mr-2 h-4 w-4" />
					<span>Billing</span>
					<CommandShortcut>⌘B</CommandShortcut>
				</CommandItem>
				<CommandItem>
					<Settings class="mr-2 h-4 w-4" />
					<span>Settings</span>
					<CommandShortcut>⌘S</CommandShortcut>
				</CommandItem>
			</CommandGroup>
		{/if}
		{#if page === "theme"}
			<CommandItem
				onSelect={() => {
					document.documentElement.setAttribute("data-theme", "light");
					document.documentElement.classList.remove("dark");
					fetch(
						"/tests?/setTheme&theme=light&redirectTo=" + $spage.url.pathname,
						{
							method: "POST",
							body: new FormData(),
						}
					);
					isOpen = false;
				}}
			>
				<Cog class="mr-2 h-4 w-4" />
				<span>Light</span>
				<!-- <CommandShortcut>⌘P</CommandShortcut> -->
			</CommandItem>
			<CommandItem
				onSelect={() => {
					document.documentElement.setAttribute("data-theme", "dark");
					document.documentElement.classList.add("dark");
					fetch(
						"/tests?/setTheme&theme=dark&redirectTo=" + $spage.url.pathname,
						{
							method: "POST",
							body: new FormData(),
						}
					);
					isOpen = false;
				}}
			>
				<Cog class="mr-2 h-4 w-4" />
				<span>Dark</span>
				<!-- <CommandShortcut>⌘P</CommandShortcut> -->
			</CommandItem>
		{/if}
	</CommandList>
</CommandDialog>

<style>
	:global([data-cmdk-list]) {
		height: min(300px, var(--cmdk-list-height));
		max-height: 400px;
		overflow: auto;
		-ms-scroll-chaining: none;
		overscroll-behavior: contain;
		transition: 0.1s ease;
		transition-property: height;
	}
</style>
