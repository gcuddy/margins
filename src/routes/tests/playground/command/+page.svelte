<script lang="ts">
	import { createCombobox, type ComboboxFilterFunction, melt } from '@melt-ui/svelte';
	import { effect, generateId } from '@melt-ui/svelte/internal/helpers';
	import { Check, ChevronDown, ChevronUp, SearchIcon } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { fly, slide } from 'svelte/transition';

	interface Book {
		author: string;
		title: string;
		disabled: boolean;
	}

	type CommandGroup = {
		group: string;
		items: Command[];
	};

	type Command = {
		name: string;
		// description: string;
		// shortcut: string;
		// icon: string;
	};

	// generate dummy commands
	let commands: CommandGroup[] = [
		// dummy commands
		{
			group: 'File',
			items: [
				{
					name: 'New'
				},
				{
					name: 'Open'
				},
				{
					name: 'Save'
				},
				{
					name: 'Save As'
				},
				{
					name: 'Close'
				},
				{
					name: 'Close All'
				},
				{
					name: 'Exit'
				}
			]
		},
		{
			group: 'Edit',
			items: [
				{
					name: 'Undo'
				},
				{
					name: 'Redo'
				},
				{
					name: 'Cut'
				},
				{
					name: 'Copy'
				},
				{
					name: 'Paste'
				},
				{
					name: 'Delete'
				},
				{
					name: 'Select All'
				}
			]
		}
	];

	const filterFunction: ComboboxFilterFunction<Command & { group: string }> = (
		item,
		inputValue
	) => {
		// Example string normalization function. Replace as needed.
		const normalize = (str: string) => str.normalize().toLowerCase();
		const normalizedInput = normalize(inputValue);
		return normalizedInput === '' || normalize(item.name).includes(normalizedInput);
	};

	let container: HTMLElement | null = null;

	let items = commands.flatMap((group) =>
		group.items.map((item) => ({ ...item, group: group.group }))
	);

	const {
		elements: { menu, input, item, label },
		states: { open, filteredItems, value, inputValue },
		helpers: { isSelected }
	} = createCombobox({
		filterFunction,
		items,
		itemToString: (item) => item.name,
		forceVisible: true,
		loop: false,
		portal: container,

		// defaultOpen: true,
		// closeOnEscape: false,
		// closeOnOutsideClick: false,
		onValueChange: (value) => {
			console.log(value);
			return value.next;
		},
		onOpenChange: (value) => {
			console.log(value);
			return value.next;
		}

		// forceVisible: true
	});


	$: console.log({ $value });

    let inputEl: HTMLInputElement;

	effect(inputValue, (value) => {
		// when input value changes, make sure data-highlighted, else get first one
		tick().then(() => {
			const highlighted = container?.querySelector('[data-highlighted]');
			if (!highlighted) {
                // simulate press down (to highlight first item - this is an ugly hack)
                inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
				// const first = container?.querySelector('[data-melt-combobox-item]');
				// if (first) {
				// 	first.setAttribute('data-highlighted', '');
				// }
			}
		});
	});

	$menu;

	type CommandChunk = {
		group: string;
		items: (Command & { group: string })[];
	};

	function chunk_commands(commands: (Command & { group: string })[]): CommandChunk[] {
		let groups: CommandChunk[] = [];
		let group: CommandChunk = {
			group: '',
			items: []
		};
		commands.forEach((command) => {
			if (group.group !== command.group) {
				group = {
					group: command.group,
					items: []
				};
				groups.push(group);
			}
			group.items.push(command);
		});
		return groups;
	}
</script>

<div class="preview flex min-h-[350px] w-full justify-center p-10 items-start">
	<div
		bind:this={container}
		class="flex h-full w-full flex-col overflow-hidden bg-popover text-popover-foreground rounded-lg border shadow-md"
	>
		<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
		<!-- <label use:melt={$label}>
				<span class="block capitalize">Choose your favorite book:</span>
			</label> -->
		<div class="flex items-center border-b px-3">
			<SearchIcon class="mr-2 h-4 w-4 shrink-0 opacity-50" />
			<input
				use:melt={$input}
                bind:this={inputEl}
				class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
				placeholder="Best book ever"
			/>
		</div>
		<ul
			class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md"
			style:position="static"
			role={$menu.role}
			id={$menu.id}
			hidden={$menu.hidden}
			transition:fly={{ duration: 150 }}
		>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="flex max-h-full flex-col overflow-y-auto px-2 py-2 divide-y" tabindex="0">
				{#if $filteredItems.length !== 0}
					{@const _filteredItems = chunk_commands($filteredItems)}
					{#each _filteredItems as { group, items }, index (index)}
						{@const groupId = generateId()}
						<div class="p-1 text-foreground">
							<span class="py-1.5 px-2 text-xs font-medium text-muted-foreground" aria-hidden="true" id={groupId}>{group}</span>
							<div role="group" aria-labelledby={groupId}>
								{#each items as command}
									<li
										use:melt={$item({
											index,
											item: command
											// disabled: book.disabled
										})}
										class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
									>
										{#if $isSelected(command)}
											<div class="check">
												<Check class="square-4" />
											</div>
										{/if}
										<div>
											<span>{command.name}</span>
											<!-- <span class="block text-sm opacity-70">{book.author}</span> -->
										</div>
									</li>
								{/each}
							</div>
						</div>
						{#if !$inputValue && index !== _filteredItems.length - 1}
							<!-- hello -->
							<!-- show separation -->
							<!-- <div class="-mx-1 h-px bg-border" role="separator" /> -->
						{/if}
					{/each}
				{:else}
					<li
						class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
                      text-neutral-800 data-[highlighted]:bg-red-100
                      data-[highlighted]:text-stone-700"
					>
						No results found
					</li>
				{/if}
			</div>
		</ul>
	</div>
</div>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-stone-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
