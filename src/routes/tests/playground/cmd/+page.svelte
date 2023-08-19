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

	import {
		Calculator,
		Calendar,
		CalendarPlusIcon,
		ChevronsUpDown,
		CreditCard,
		FileIcon,
		Settings,
		Smile,
		User
	} from 'lucide-svelte';

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

	let value: typeof data.entries[0];
	import { Popover, PopoverContent, PopoverTrigger } from '$components/ui/popover';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { writable } from 'svelte/store';
	import { cn } from '$lib';
	import { buttonVariants } from '$components/ui/Button.svelte';
	import { melt } from '@melt-ui/svelte';
	import { tick } from 'svelte';
	import { isHTMLInputElement } from '@melt-ui/svelte/internal/helpers';
	import { assertPagesType, createPages } from '$components/ui/command2/utils';
	import { types } from '$lib/types';
	import { statuses, statusesWithIcons } from '$lib/status';
	import type { StringsToObjWithKey } from '$lib/utils/type-utils';
	import { Checkbox } from '$components/ui/checkbox';

	let open = false;
	$: console.log({ open });
	let buttonEl: HTMLButtonElement;
	const closePopover = () => {
		open = false;
		// TODO this triggers it re-opening immediately
		// if (buttonEl) {
		//     tick().then(() => {
		//         buttonEl.focus();
		//     })
		// }
	};

	// const page = createPages<'projects' | 'teams'>();

	type Pages = 'projects' | 'teams';
	const pages: StringsToObjWithKey<Pages, 'name'>[] = [];

	// const filterPages = assertPagesType({
	//     name: "types",
	//     placeholder: ""
	// })

	const filterPages = [
		{
			name: 'types',
			placeholder: 'Select a type…'
		},
		{
			name: 'dates:created',
			placeholder: 'Select a date…'
		},
		{
			name: 'status',
			placeholder: 'Select a status…'
		}
	] as const;

	type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

	const deepWriteable = <T>(obj: T): DeepWriteable<T> => {
		return obj as DeepWriteable<T>;
	};

	const pagesData = deepWriteable(filterPages);

	let tagValue = [];
	let tagsOpen = false;

	const chosenTags = writable(data.tags.slice(0, 2));

	function sortFunction(a: typeof data.tags[number], b: typeof data.tags[number]) {
		const selected = $chosenTags.find((t) => t.id === a.id);
		const selected2 = $chosenTags.find((t) => t.id === b.id);
		if (selected && selected2) {
			return 0;
		} else if (selected) {
			return -1;
		} else if (selected2) {
			return 1;
		} else {
			return 0;
		}
	}

	let sortedTags = [...data.tags].sort(sortFunction);

	$: if (!tagsOpen) {
		sortedTags = [...data.tags].sort(sortFunction);
	}
</script>

<div
	class="preview max-w-xl mx-auto flex flex-col gap-10 min-h-[350px] w-full justify-center p-10 items-start"
>
	<Popover
		bind:open
		onOpenChange={(e) => {
			console.log({ e });
		}}
	>
		<PopoverTrigger asChild let:builder>
			<button
				bind:this={buttonEl}
				class={cn(buttonVariants({ variant: 'outline' }), 'w-[200px] justify-between')}
				use:melt={builder}
			>
				<span class="truncate">{value ? value.title : 'Select an entry'}</span>
				<ChevronsUpDown class="h-4 w-4 ml-2 shrink-0 opacity-50" />
			</button>
		</PopoverTrigger>
		<PopoverContent class="w-[200px] p-0">
			<Command
				let:filtered
				onClose={closePopover}
				type={data.entries[0]}
				valueToString={(item) => item.title}
				bind:value
			>
				<CommandInput />
				<CommandList>
					<CommandGroup>
						<!-- {#each filtered.items as item, index (item.id)}
							<CommandItem id={filtered.ids[index]} shouldRegister={false} value={item}>
								<EntryIcon class="h-4 w-4 shrink-0 mr-2" type={item.type} />
								<span>{item.title}</span>
							</CommandItem>
						{/each} -->
						<!-- onSelect={closePopover} -->

						<CommandItems items={data.entries} itemToId={(item) => item.id.toString()} let:item>
							<EntryIcon class="h-4 w-4 shrink-0 mr-2" type={item.type} />
							<span>{item.title}</span>
						</CommandItems>
					</CommandGroup>
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>
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

	with pages:
	<Command
		let:page
		let:pages
		initialPages={pages}
		class="rounded-lg border shadow-md w-fit"
		bounce={true}
	>
		<CommandInput placeholder="Type a command or search..." onKeydown={pages.handlers.keydown} />
		<CommandList>
			<CommandGroup>
				{#if !page}
					<CommandItem
						containsPages
						onSelect={() => {
							console.log('selecting');
							pages.add({
								name: 'projects'
							});
						}}
					>
						Search Projects…
					</CommandItem>
					<CommandItem
						containsPages
						onSelect={() => {
							pages.add({
								name: 'teams'
							});
						}}
					>
					z	Join a team…
					</CommandItem>
				{/if}
				{#if page?.name === 'projects'}
					<CommandItem
						>Project A With A Really Long Title That Should be Truncated With Ellipsis At Some
						Point, Maybe Now Or Maybe Later
					</CommandItem>
					<CommandItem>Project B</CommandItem>
				{:else if page?.name === 'teams'}
					<CommandItem>Team A</CommandItem>
					<CommandItem>Team B</CommandItem>
				{/if}
			</CommandGroup>
		</CommandList>
	</Command>
	Filter:
	<Command let:page let:pages pages={pagesData} class="rounded-lg border shadow-md">
		<CommandInput
			placeholder={page?.placeholder ?? 'Type a command or search...'}
			onKeydown={pages.handlers.keydown}
		/>
		<CommandList>
			<CommandGroup>
				{#if !page}
					<CommandItem
						containsPages
						onSelect={() => {
							console.log('selecting');
							pages.add('types');
						}}
					>
						<FileIcon class="mr-2 h-4 w-4 opacity-50" />
						<span>Type</span>
					</CommandItem>
					<CommandItem
						containsPages
						onSelect={() => {
							pages.add('dates:created');
						}}
					>
						<CalendarPlusIcon class="mr-2 h-4 w-4 opacity-50" />
						Saved Date
					</CommandItem>
					<CommandItem
						containsPages
						onSelect={() => {
							pages.add('status');
						}}
					>
						<CalendarPlusIcon class="mr-2 h-4 w-4 opacity-50" />
						Status
					</CommandItem>
				{/if}
				{#if page?.name === 'types'}
					{#each types as type}
						<CommandItem>
							<EntryIcon
								class="h-4 w-4 shrink-0 mr-2 opacity-50 group-data-[highlighted]:opacity-100 transition-opacity"
								{type}
							/>
							<span>{type}</span>
						</CommandItem>
					{/each}
				{:else if page?.name === 'dates:created'}
					<CommandItem>1 Day</CommandItem>
					<CommandItem>3 Days</CommandItem>
					<CommandItem>1 Week</CommandItem>
					<CommandItem>2 Weeks</CommandItem>
					<CommandItem>1 Month</CommandItem>
					<CommandItem>3 Months</CommandItem>
					<CommandItem>6 Months</CommandItem>
					<CommandItem>1 Year</CommandItem>
					<!-- <CommandSeparator /> -->
					<CommandItem>Custom…</CommandItem>
					<CommandItem>Exact Date…</CommandItem>
				{:else if page?.name === 'status'}
					{#each statuses as status}
						<CommandItem>
							<svelte:component this={statusesWithIcons[status]} class="h-4 w-4 shrink-0 mr-2" />
							<span>{status}</span>
						</CommandItem>
					{/each}
				{/if}
			</CommandGroup>
		</CommandList>
	</Command>

	Multiple:

	{$chosenTags.map((t) => t.name)}
	<Popover bind:open={tagsOpen}>
		<PopoverTrigger asChild let:builder>
			<button
				bind:this={buttonEl}
				class={cn(buttonVariants({ variant: 'outline' }), 'w-[200px] justify-between')}
				use:melt={builder}
			>
				<span class="truncate">{'Select a tag'}</span>
				<ChevronsUpDown class="h-4 w-4 ml-2 shrink-0 opacity-50" />
			</button>
		</PopoverTrigger>
		<PopoverContent class="w-[200px] p-0">
			<Command
				onClose={() => {
					tagsOpen = false;
				}}
				selectedValue={chosenTags}
				valueToString={(tag) => tag.name}
				multiple
				class="rounded-lg border shadow-md"
			>
				<CommandInput />
				<CommandList>
					<CommandGroup>
						{#each sortedTags as tag}
							<CommandItem value={tag} cancelClose="[data-melt-checkbox], svg" let:isSelected>
								<Checkbox class="mr-2" checked={isSelected} />
								<span>{tag.name}</span>
							</CommandItem>
						{/each}
					</CommandGroup>
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>
</div>
