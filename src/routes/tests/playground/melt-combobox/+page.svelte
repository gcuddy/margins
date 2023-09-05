<script lang="ts">
	import {
		type ComboboxFilterFunction,
		createCombobox,
		melt,
	} from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	type Book = {
		author: string;
		disabled: boolean;
		title: string;
	};

	const books: Array<Book> = [
		{
			author: 'Harper Lee',
			disabled: false,
			title: 'To Kill a Mockingbird',
		},
		{
			author: 'Lev Tolstoy',
			disabled: false,
			title: 'War and Peace',
		},
		{
			author: 'Fyodor Dostoyevsy',
			disabled: true,
			title: 'The Idiot',
		},
		{
			author: 'Oscar Wilde',
			disabled: false,
			title: 'A Picture of Dorian Gray',
		},
		{
			author: 'George Orwell',
			disabled: false,
			title: '1984',
		},
		{
			author: 'Jane Austen',
			disabled: false,
			title: 'Pride and Prejudice',
		},
		{
			author: 'Marcus Aurelius',
			disabled: false,
			title: 'Meditations',
		},
		{
			author: 'Fyodor Dostoevsky',
			disabled: false,
			title: 'The Brothers Karamazov',
		},
		{
			author: 'Lev Tolstoy',
			disabled: false,
			title: 'Anna Karenina',
		},
		{
			author: 'Fyodor Dostoevsky',
			disabled: false,
			title: 'Crime and Punishment',
		},
	];

	const filterFunction: ComboboxFilterFunction<Book> = ({
		input,
		itemValue,
	}) => {
		// Example string normalization function. Replace as needed.
		const normalize = (str: string) => str.normalize().toLowerCase();
		const normalizedInput = normalize(input);
		return (
			normalizedInput === '' ||
			normalize(itemValue.title).includes(normalizedInput) ||
			normalize(itemValue.author).includes(normalizedInput)
		);
	};

	const {
		elements: { input, label, menu, option },
		helpers: { isSelected },
		states: { isEmpty, open },
	} = createCombobox({
		filterFunction,
		forceVisible: true,
	});
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class="text-sm font-medium text-stone-900"
			>Choose your favorite book:</span
		>
	</label>

	<div class="relative">
		<input
			use:melt={$input}
			class="flex h-10 items-center justify-between rounded-lg bg-white
            px-3 pr-12 text-black"
			placeholder="Best book ever"
		/>
		<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-stone-900">
			{#if $open}
				<ChevronUp class="square-4" />
			{:else}
				<ChevronDown class="square-4" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
			tabindex="0"
		>
			{#each new Array(1000) as _, index (index)}
				{@const idx = index % books.length || 0}
				{@const book = books[idx]}
				<li
					use:melt={$option({
						disabled: book.disabled,
						label: book.title,
						value: book,
					})}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
          data-[highlighted]:bg-stone-200 data-[highlighted]:text-stone-900
            data-[disabled]:opacity-50"
				>
					{#if $isSelected(book)}
						<div class="check absolute left-2 top-1/2 z-10 text-stone-900">
							<Check class="square-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium">{book.title}</span>
						<span class="block text-sm opacity-75">{book.author}</span>
					</div>
				</li>
			{/each}
			{#if $isEmpty}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
          data-[highlighted]:bg-stone-100 data-[highlighted]:text-stone-700"
				>
					No results found
				</li>
			{/if}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-stone-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
