<script lang="ts">
	import {
		CommandDialog,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from "$lib/components/ui/command";
	let isOpen = false;
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === "j" && e.metaKey) {
			console.log("setting isOpen");
			isOpen = true;
		}
	}}
/>

Press cmd+j
<!-- onisOpenChange={setisOpen} -->
{isOpen}
<CommandDialog bind:isOpen>
	<CommandInput placeholder="Type a command or search..." />
	<CommandList>
		<CommandEmpty>No results found.</CommandEmpty>
		<CommandGroup heading="Suggestions">
			<CommandItem>Calendar</CommandItem>
			<CommandItem>Search Emoji</CommandItem>
			<CommandItem>Calculator</CommandItem>
		</CommandGroup>
	</CommandList>
</CommandDialog>
