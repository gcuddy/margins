<script lang="ts">
	import {
		Calculator,
		Calendar,
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

	let isOpen = false;
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

<CommandDialog
	bind:isOpen
	class="rounded-lg border border-gray-100  shadow-md  dark:border-gray-800"
>
	<CommandInput placeholder="Type a command or search..." />
	<CommandList class="scrollbar-hide">
		<CommandEmpty>No results found.</CommandEmpty>
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
			<CommandItem>
				<User class="mr-2 h-4 w-4" />
				<span>Profile</span>
				<CommandShortcut>⌘P</CommandShortcut>
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
