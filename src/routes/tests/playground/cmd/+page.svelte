<script lang="ts">
	import {
		Command,
		CommandInput,
		CommandItem,
		CommandItems,
		CommandList,
		CommandGroup,
		CommandEmpty,
		CommandSeparator,
		CommandShortcut
	} from '$lib/components/ui/command2';

	import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-svelte';

	export let data;

	const books = [
		'The Lord of the Rings',
		'The Hobbit',
		'The Silmarillion',
		'The Children of Húrin',
		'Unfinished Tales',
		'The History of Middle-earth',
		'The History of The Hobbit'
	];

	let value: string;
	import { Popover, PopoverContent, PopoverTrigger } from '$components/ui/popover2';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
</script>

<Popover>
	<PopoverTrigger>Combobox</PopoverTrigger>
	<PopoverContent>
		{value}
		<Command bind:value>
			<CommandInput />
			<CommandList>
				<CommandItems
					items={data.entries}
					itemToId={(item) => item.id.toString()}
					itemToValue={(item) => item.title.toString()}
					let:item
					onSelect={(item) => console.log(item)}
					class="flex"
				>
					<!-- <img class="square-8 rounded mr-2" src={item.image} alt={item.title} /> -->
					<EntryIcon class="h-4 w-4 shrink-0 mr-2" type={item.type} />
					<span>{item.title}</span>
				</CommandItems>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
<div class="preview max-w-xl mx-auto flex min-h-[350px] w-full justify-center p-10 items-start">
	<Command class="rounded-lg border shadow-md">
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
