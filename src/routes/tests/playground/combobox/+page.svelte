<script lang="ts">
	import { page } from '$app/stores';
	import Combobox from '$components/ui/combobox/Combobox.svelte';
	import type { EntryInList } from '$lib/db/selects';
	import { query } from '$lib/queries/query';
	import { entries_in_state } from '$lib/state/entries';
	import { recents } from '$lib/stores/recents';
	import debounce from 'just-debounce-it';
	import { tick } from 'svelte';
	interface Book {
		author: string;
		title: string;
		disabled: boolean;
	}

	let books: Book[] = [
		{
			author: 'Harper Lee',
			title: 'To Kill a Mockingbird',
			disabled: false
		},
		{
			author: 'Lev Tolstoy',
			title: 'War and Peace',
			disabled: false
		},
		{
			author: 'Fyodor Dostoyevsy',
			title: 'The Idiot',
			disabled: true
		},
		{
			author: 'Oscar Wilde',
			title: 'A Picture of Dorian Gray',
			disabled: false
		},
		{
			author: 'George Orwell',
			title: '1984',
			disabled: false
		},
		{
			author: 'Jane Austen',
			title: 'Pride and Prejudice',
			disabled: false
		},
		{
			author: 'Marcus Aurelius',
			title: 'Meditations',
			disabled: false
		},
		{
			author: 'Fyodor Dostoevsky',
			title: 'The Brothers Karamazov',
			disabled: false
		},
		{
			author: 'Lev Tolstoy',
			title: 'Anna Karenina',
			disabled: false
		},
		{
			author: 'Fyodor Dostoevsky',
			title: 'Crime and Punishment',
			disabled: false
		}
	];

	function filterFunction(item: EntryInList, inputValue: string) {
		// Example string normalization function. Replace as needed.
		const normalize = (str: string) => str.normalize().toLowerCase();
		const normalizedInput = normalize(inputValue);
		return (
			normalizedInput === '' ||
			normalize(item.title ?? '').includes(normalizedInput) ||
			normalize(item.author ?? '').includes(normalizedInput)
		);
	}

	let input = '';

	let items = $recents.entries;

	// Could also do a placeholder search on the current state or whatever

	function add_to_items(new_items: EntryInList[]) {
		const items_we_dont_have = new_items.filter((new_item) =>
			items.some((item) => item.id !== new_item.id)
		);
        console.log({items_we_dont_have})
		const items_to_filter = [...items, ...items_we_dont_have];
		// let's make sure we don't add the same thing twice by making a set with the ids
		const item_ids = new Set(items_to_filter.map((i) => i.id));
		items = Array.from(item_ids)
			.map((id) => items_to_filter.find((item) => item.id === id))
			.filter(Boolean);
	}

	async function search() {
		console.log(`Running search`);
		if (!input) {
			// items = $recents.entries
			return;
		}
		// Because we're filtering as typing, we should append the new items to the end of the old one as to not create a jarring experience
		// To do that, we'll check to make sure the current items are in the new items. If they are, move them to the top in the order that they are currently in.

		// query our state too
		const stated_entries = $entries_in_state.filter((e) => {
			return filterFunction(e, input);
		});
		console.log({ stated_entries });

		const new_items = await query(
			$page,
			'search_titles',
			{
				q: input
			},
			{
				cache: true
			}
		);

        console.log({new_items})

		add_to_items(new_items);
		return;

		const already_existing_items: EntryInList[] = [];
		const items_to_append: EntryInList[] = [];

		// const already_existing_items = new_items.filter(new_item => items.some(item => item.id === new_item.id));

		new_items.forEach((newItem, index) => {
			if (items.some((item) => item.id === newItem.id)) {
				already_existing_items.push(newItem);
				return;
			} else {
				items_to_append.push(newItem);
			}
		});

		// This is potentially slow
		items = [...already_existing_items, ...items_to_append];
	}

	const debounced_search = debounce(search, 500);

	$: if (input) {
		debounced_search();
	} else {
		items = $recents.entries;
	}
</script>

<Combobox
	bind:input
	{items}
	{filterFunction}
	itemId={'id'}
	itemToString={(item) => item.title ?? ''}
/>
