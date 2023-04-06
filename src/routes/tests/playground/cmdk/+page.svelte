<script>
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
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator,
		CommandShortcut,
	} from "$lib/components/ui/command";
</script>

<div class="p-10">
	<Command
		class="rounded-lg border border-slate-100  shadow-md dark:border-slate-800"
	>
		<CommandInput placeholder="Type a command or search..." />
		<CommandList>
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
	</Command>
</div>
