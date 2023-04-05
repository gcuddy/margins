<script>
	import Command from "$lib/components/ui/cmdk/Command.Root.svelte";
	import CommandInput from "$lib/components/ui/cmdk/Command.Input.svelte";
	import CommandEmpty from "$lib/components/ui/cmdk/Command.Empty.svelte";
	import CommandList from "$lib/components/ui/cmdk/Command.List.svelte";
	import CommandGroup from "$lib/components/ui/cmdk/Command.Group.svelte";
	import CommandItem from "$lib/components/ui/cmdk/Command.Item.svelte";
	import CommandSeparator from "$lib/components/ui/cmdk/Command.Separator.svelte";
</script>

<Command>
	<CommandInput placeholder="Search..." />
	<CommandList>
		<CommandEmpty>No results found.</CommandEmpty>
		<CommandGroup heading="Suggestions">
			<CommandItem>
				<span>Calendar</span>
			</CommandItem>
			<CommandItem>
				<span>Search Emoji</span>
			</CommandItem>
			<CommandItem>
				<span>Calculator</span>
			</CommandItem>
		</CommandGroup>
		<CommandSeparator />
		<CommandGroup heading="Settings">
			<CommandItem>
				<span>Profile</span>
			</CommandItem>
			<CommandItem>
				<span>Billing</span>
			</CommandItem>
			<CommandItem>
				<span>Settings</span>
			</CommandItem>
		</CommandGroup>
	</CommandList>
</Command>
