<script lang="ts" context="module">
	export type BaseCommandGroup = {
		group?: string;
		disabled?: boolean;
		loading?: boolean;
		items: Command<any>[];
	};
	export type CommandGroup = StoreOrVal<BaseCommandGroup>;

	type Component<T extends SvelteComponent> =
		| {
				icon: ComponentType<T>;
				props?: ComponentProps<T>;
		  }
		| {
				icon?: undefined;
				props?: never;
		  };

	type ActionOrPage =
		| {
				action?: () => void;
				addPage?: never;
		  }
		| {
				action?: never;
				addPage: () =>
					| StoreOrVal<CommandGroup[]>
					| {
							page: StoreOrVal<CommandGroup[]>;
							placeholder?: string;
							destroy?: () => void;
					  };
		  };

	export type Command<T extends SvelteComponent> =
		| {
				name: string;
				id?: string;
				selected?: boolean;
				description?: string | null;
				kbd?: string;
				/** Additional terms to filter by. Will be added to name when filtering. */
				terms?: string | null;
				img?: string | null;
				// action?: () => void;
		  } & ActionOrPage &
				Component<T>;

	export function item<T extends SvelteComponent>(command: Command<T>) {
		return command;
	}
</script>

<script lang="ts">
	import {
		createCombobox,
		type ComboboxFilterFunction,
		melt,
		CreateComboboxProps,
		createPopover
	} from '@melt-ui/svelte';
	import { effect, generateId, isElementDisabled } from '@melt-ui/svelte/internal/helpers';
	import {
		CalendarIcon,
		Check,
		ChevronDown,
		ChevronUp,
		PartyPopperIcon,
		SearchIcon,
		Store
	} from 'lucide-svelte';
	import {
		ComponentProps,
		ComponentType,
		SvelteComponent,
		createEventDispatcher,
		getContext,
		onDestroy,
		tick
	} from 'svelte';
	import { fly, slide } from 'svelte/transition';

	import commandScore from 'command-score';
	import { omit } from '$lib/helpers';
	import { Readable, Writable, get, writable } from 'svelte/store';
	import { cn } from '$lib/utils/tailwind';
	import { dev } from '$app/environment';
	import { createStack } from '$lib/stores/undo';
	import type { StoreOrVal } from '@tanstack/svelte-query';
	import { checkedEntryIds } from '$components/entries/multi-select';
	import Badge from '../Badge.svelte';

	const dispatch = createEventDispatcher();

	interface Book {
		author: string;
		title: string;
		disabled: boolean;
	}

	// TODO: allow commands to be passed in also without group

	// generate dummy commands

	export let open = writable(false);
	export let onChange = (value: Command<any>) => {
		open.set(false);
	};

	export let autofocus = true;
	/** Applys dialog classes */
	export let dialog = false;

	export let showSelectActions = false;

	export let term = '';

	export let closeOnAction = true;

    let internalBounce = true;
    export { internalBounce as bounce};

	const dialogContentEl = getContext('dialogContentEl') as Writable<HTMLElement | null>;

	const popover = getContext('Popover') as ReturnType<typeof createPopover> | null;

	export let items: StoreOrVal<CommandGroup[]> = [
		// dummy commands
		{
			group: 'File',
			items: [
				{
					name: 'New',
					icon: CalendarIcon
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

	const stack = createStack(items);

	const DEFAULT_PLACEHOLDER = 'Type a command or search…';
	export let placeholder = DEFAULT_PLACEHOLDER;
	export let defaultValue: CreateComboboxProps<Item>['defaultValue'] = undefined;
	export let defaultId: string | undefined = undefined;
	let currentPlaceholder = placeholder;

	$stack.root;

	function bounce() {
        if (!internalBounce) return;
		const node = container?.closest('[data-melt-dialog-content]') ?? container?.closest('[data-melt-popover-content]') ?? container;
        console.log({node})
		if (node) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;
			node.classList.add(`scale-[0.96]`);
			// node.style.transform = `${transform} scale(0.96)`;
			setTimeout(() => {
				if (node) node.classList.remove(`scale-[0.96]`);
			}, 100);
		}
	}

	function reset() {
		bounce();
		term = '';
		currentCallbacks.forEach((cb) => cb());
		currentCallbacks = [];
		currentOnRemove?.();
		currentOnRemove = undefined;
		currentPlaceholder = placeholder || DEFAULT_PLACEHOLDER;
		tick().then(() => {
			// and now dispatch an input event to trigger filtering
			inputEl.dispatchEvent(new Event('input'));
		});
	}

	let currentOnRemove: (() => void) | undefined = undefined;

	export function addPage(
		page: StoreOrVal<CommandGroup[]>,
		opts?: {
			onRemove?: () => void;
			placeholder?: string;
		}
	) {
		const { onRemove, placeholder: newPlaceholder } = opts || {};
		const a = stack.push(page);
		reset();
		currentOnRemove = onRemove;
		currentPlaceholder = newPlaceholder || placeholder || DEFAULT_PLACEHOLDER;
	}

	export function back() {
		console.log(`back`, { $stack });
		if (!$stack.previous) return;
		stack.undo();
		// bounce();
		reset();
		// should only occur when term already === ""
		dispatch('back');
	}

	const scores = new Map<string, WeakMap<Command<any>, number>>();

	$: value_map = scores.get($inputValue);

	$: console.log({ value_map });

	// we re-implement select item to prevent list being reset
	function selectItem(node: HTMLElement) {
		if (node.dataset.index) {
			const index = parseInt(node.dataset.index, 10);
			const $item = $filteredItems[index];
			value.set($item);
		}
	}

	const filterFunction: ComboboxFilterFunction<Command<any> & { group: string }> = (
		item,
		inputValue
	) => {
		const value_map = scores.get(inputValue) ?? new WeakMap();
		const term = item.name + (item.terms ? ' ' + item.terms : '');
		// TODO: boost title matches higher than terms matches (modify commandScore myself)
		const score = commandScore(term, inputValue);
		value_map.set(item, score);
		scores.set(inputValue, value_map);
		console.log({ scores });
		console.log({ score, item, inputValue });
		// TODO: sort by score (but keep group order)
		return score > 0;
		const normalize = (str: string) => str.normalize().toLowerCase();
		const normalizedInput = normalize(inputValue);
		return normalizedInput === '' || normalize(item.name).includes(normalizedInput);
	};

	let container: HTMLElement | null = null;

	type Item = Command<any> & { group: string; index: number };

	let i = 0;
	let flattenedItems: Item[] = [];

	let currentCallbacks: (() => void)[] = [];

	const group_stores = new Map<string, Readable<Command<any>[] | { data: Command<any>[] }>>();

	$stack.current;

	export let loading = false;

	function getFlattenedItems(items: StoreOrVal<CommandGroup[]>): Item[] {
		console.log(`getFlattenedItems`);
		let i = 0;
		let value: CommandGroup[];
		if ('subscribe' in items) {
			// then it's a store
			value = get(items);
		} else {
			// then it's a group
			value = items;
		}
		console.log({ value });
		// value.map((group) => {
		// 	if ('subscribe' in group) {
		// 		const data = get(group);
		// 		let unsub = group.subscribe(($group) => {
		// 			// TODO don't love this overhead
		// 			getFlattenedItems($stack.current);
		// 			// flattenedItems = flattenedItems.map(item => {
		// 			//     if (item.group === $group.group) {
		// 			//         return { ...item, group: $group.group, index: i };
		// 			//     } else {
		// 			//         return item;
		// 			//     }
		// 			// })
		// 		});
		// 		return data;
		// 	} else {
		// 		return group;
		// 	}
		// });

		return value
			.map((group) => {
				if ('subscribe' in group) {
					// we should only need to read this data once (hopefully)
					const data = get(group);
					return data;
				} else {
					return group;
				}
			})
			.filter((group) => !group.disabled)
			.flatMap((group) => {
				// if any group is loading, toggle loading boolean

				return group.items.map((item, index) => {
					const newItem = { ...item, group: group.group, index: i };
					i++;
					return newItem;
				});
			});
	}
	$: console.log({ flattenedItems });

	$: if ('subscribe' in $stack.current) {
		let unsub = $stack.current.subscribe((items) => {
			flattenedItems = getFlattenedItems(items);
		});
		currentCallbacks.push(unsub);
	} else {
		flattenedItems = getFlattenedItems($stack.current);
	}
	// update items with flattened items, when necessary
	$: updateItems(() => {
		if (dev) {
			console.log('updateItems');
		}
		return flattenedItems;
	});

	export function clear() {
		value.set(undefined);
		// inputEl.value = '';
		scores.clear();
	}

	// TODO combobox should be allowed to select multiple
	$: selected = flattenedItems.find((f) => f.selected);
	// $: if (selected) {
	// 	value.set(selected);
	// }

	$: console.log({ open });

	const {
		elements: { menu, input, item, label },
		states: { filteredItems, value, inputValue },
		helpers: { isSelected, updateItems }
	} = createCombobox({
		filterFunction,
		items: flattenedItems,
		itemToString: (item) => item.name,
		open,
		forceVisible: true,
		loop: false,
		portal: container,
		defaultValue,
		// defaultOpen: true,
		closeOnEscape: false,
		closeOnOutsideClick: false,
		onValueChange: (value) => {
			console.log(`onValueChange`, { value });
			if (changing) {
				changing = false;
				return value.curr;
			}
			if (value.next?.action) {
				console.log(`Running action`, value.next);
				value.next.action();
				if (closeOnAction) open.set(false);
			} else if (value.next?.addPage) {
				const page = value.next.addPage();
				if ('page' in page) {
					addPage(page.page, {
						onRemove: page.destroy
					});
				} else {
					addPage(page);
				}
			}
			if (value.next) if (value.next) onChange(value.next);
			console.log({ value });
			return value.curr;
		}

		// forceVisible: true
	});

	$: console.log({ $value });

	let changing = false;

	$: if (defaultId) {
		const item = flattenedItems.find((item) => item.id === defaultId);
		if (item) {
			changing = true;
			value.set(item);
		}
	}

	let inputEl: HTMLInputElement;

	function highlightItem() {
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
	}

	effect(inputValue, (value) => {
		// when input value changes, make sure data-highlighted, else get first one
		highlightItem();
	});

	$: flattenedItems, highlightItem();

	type CommandChunk = {
		group: string;
		items: Item[];
	};

	function chunk_commands(commands: Item[], sort = true): CommandChunk[] {
		let group_map = new Map<string, CommandChunk['items']>();
		if (sort && value_map) {
			commands.sort((a, b) => {
				if (!value_map) return 0;
				const a_score = value_map.get(a) ?? 0;
				const b_score = value_map.get(b) ?? 0;
				return b_score - a_score;
			});
		}
		commands.forEach((command) => {
			const g = group_map.get(command.group);
			if (g) {
				g.push(command);
			} else {
				group_map.set(command.group, [command]);
			}
		});

		// now turn group_map into CommandChunk[]
		let i = 0;
		const groups = Array.from(group_map.entries()).map(([group, items]) => ({
			group,
			items: items.map((item) => ({ ...item, index: i++ }))
		}));
		console.log({ groups });
		return groups;
	}

	let className = '';
	export { className as class };

	onDestroy(() => {
		currentCallbacks.forEach((cb) => cb());
	});
</script>

<!-- TODO: trnsition width -->
<div
	bind:this={container}
	class={cn(
		'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground transition-transform duration-200 ease',
		className
	)}
>
	<!-- class="flex h-full w-full flex-col overflow-hidden bg-popover text-popover-foreground rounded-lg border shadow-md" -->
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<!-- <label use:melt={$label}>
				<span class="block capitalize">Choose your favorite book:</span>
			</label> -->
	{#if showSelectActions && $checkedEntryIds.length}
		<Badge variant="secondary" class="mt-2 mx-2 self-start font-normal text-xs">
			{#if $checkedEntryIds.length === 1}
				<!-- TODO: get titles -->
				{$checkedEntryIds.length} entry selected
			{:else}
				{$checkedEntryIds.length} entries selected
			{/if}
		</Badge>
	{/if}
	<div class="flex items-center border-b px-3">
		<SearchIcon class="mr-2 {dialog ? 'square-5' : 'square-4'} shrink-0 opacity-50" />
		<input
			{autofocus}
			use:melt={$input}
			bind:this={inputEl}
			bind:value={term}
			on:m-keydown={(e) => {
				if (e.detail.originalEvent.key === 'Backspace') {
					if ($inputValue === '') {
						e.detail.cancel();
						back();
					}
				}
				if (e.detail.originalEvent.key !== 'Enter') {
					return;
				}
				e.detail.cancel();
				const highlighted_item = container?.querySelector('[data-highlighted]');
				if (highlighted_item && highlighted_item instanceof HTMLElement) {
					selectItem(highlighted_item);
				}
			}}
			class={cn(
				'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
				dialog && 'h-12'
			)}
			placeholder={currentPlaceholder}
		/>
	</div>
	<ul
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md"
		style:position="static"
		role={$menu.role}
		id={$menu.id}
		hidden={$menu.hidden}
	>
		<!-- transition:fly={{ duration: 150 }} -->
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!--  px-2 py-2 -->
		<div class="flex max-h-full flex-col overflow-y-auto divide-y" tabindex="0">
			{#if $filteredItems.length !== 0}
				{@const _filteredItems = chunk_commands($filteredItems)}
				{#each _filteredItems as { group, items }, index (index)}
					{@const groupId = generateId()}
					<div class="p-1 px-2 text-foreground">
						{#if group}
							<span
								data-cmd-heading
								class={cn('py-1.5 px-2 text-xs font-medium text-muted-foreground')}
								aria-hidden="true"
								id={groupId}>{group}</span
							>
						{/if}
						<div role="group" aria-labelledby={groupId} class={cn()}>
							<!-- // dialog && 'px-2 ' -->
							{#each items as command}
								<li
									on:m-click={(e) => {
										e.detail.cancel();
										const node = e.currentTarget;
										if (!(node instanceof HTMLElement)) return;
										if (isElementDisabled(node)) {
											e.preventDefault();
											return;
										}
										selectItem(node);
										// open.set(false);
									}}
									use:melt={$item({
										index: command.index,
										item: command
										// disabled: book.disabled
									})}
									class={cn(
										'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
										dialog && 'py-3'
									)}
								>
									<!-- {#if $isSelected(command)}
											<div class="check">
												<Check class="square-4" />
											</div>
										{/if} -->
									{#if command.icon}
										<svelte:component
											this={command.icon}
											class={cn(
												'mr-2',
												dialog ? 'square-4' : 'square-4',
												command.props?.class || ''
											)}
											{...omit(command.props || {}, 'class')}
										/>
									{:else if command.img}
										<img src={command.img} class="square-7 rounded object-cover shadow mr-2" />
									{/if}
									{#if command.description}
										<div class="flex flex-col flex-1 truncate">
											<span>{command.name}</span>
											<span class="text-xs text-muted-foreground">
												{command.description}
											</span>
										</div>
									{:else}
										<span>{command.name}</span>
									{/if}
									{#if command.selected || $isSelected(command)}
										<Check class="square-4 ml-auto text-muted-foreground" />
									{:else if command.kbd}
										<kbd class="ml-auto text-xs text-muted-foreground tracking-widest"
											>{command.kbd}</kbd
										>
									{/if}
									<!-- <span class="block text-sm opacity-70">{book.author}</span> -->
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
				<li class="py-6 text-center text-sm">
					{#if loading}
						Loading...
					{:else}
						No results found
					{/if}
				</li>
			{/if}
		</div>
	</ul>
</div>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-stone-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
