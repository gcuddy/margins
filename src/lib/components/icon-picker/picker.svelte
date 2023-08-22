<script lang="ts">
	import { Button } from '$components/ui/button';
	import * as Popover from '$components/ui/popover';
	import { melt } from '@melt-ui/svelte';
	import { CheckIcon, FileIcon, HashIcon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import {
		BookMarked,
		Layers,
		Box,
		Library,
		Rss,
		SearchIcon,
		TreePine,
		Home,
		Tag,
		PinIcon,
		BrainCircuit,
		FlowerIcon,
		PlusCircle,
		Loader,
		ChevronDownIcon,
		RssIcon,
		Sparkles,
		Sparkle,
		Sun,
		Glasses,
		Eye,
		Contrast,
		Accessibility,
		Baby,
		LifeBuoy,
		Moon,
		Orbit,
		Star,
		Circle,
		Bird,
		Bone,
		Dog,
		Cat,
		Fish,
		Chrome,
		Dribbble,
		Github,
		Building,
		Building2,
		Castle,
		Church,
		Factory,
		GraduationCap,
		Hotel,
		Landmark,
		School,
		Store,
		UtilityPole,
		Warehouse,
		Wand,
		Apple,
		Banana,
		Trees,
		Activity,
		Atom
	} from 'lucide-svelte';
	import { chunk, styleToString } from '$lib/helpers';
	import { colors, hexCodeRegexWithoutHash, hexCharacters } from '$lib/colors';
	import { cn } from '$lib/utils';

	export let activeIcon: string = "File";
	let className = '';
	export { className as class };
	export let icons: {
		name: string;
		component: ComponentType;
	}[] = [
		{
			name: 'File',
			component: FileIcon
		},
		{
			name: 'Bookmarked',
			component: BookMarked
		},
		{
			name: 'Layers',
			component: Layers
		},
		{
			name: 'Box',
			component: Box
		},
		{
			name: 'Library',
			component: Library
		},
		{
			name: 'Rss',
			component: Rss
		},
		{
			name: 'Search',
			component: SearchIcon
		},
		{
			name: 'Tree',
			component: TreePine
		},
		{
			name: 'Home',
			component: Home
		},
		{
			name: 'Tag',
			component: Tag
		},
		{
			name: 'Pin',
			component: PinIcon
		},
		{
			name: 'Brain',
			component: BrainCircuit
		},
		{
			name: 'Flower',
			component: FlowerIcon
		},
		{
			name: 'Plus',
			component: PlusCircle
		},
		{
			name: 'Loader',
			component: Loader
		},
		{
			name: 'Chevron',
			component: ChevronDownIcon
		},
		{
			name: 'Rss',
			component: RssIcon
		},
		{
			name: 'Sparkles',
			component: Sparkles
		},
		{
			name: 'Sparkle',
			component: Sparkle
		},
		{
			name: 'Sun',
			component: Sun
		},
		{
			name: 'Glasses',
			component: Glasses
		},
		{
			name: 'Eye',
			component: Eye
		},
		{
			name: 'Contrast',
			component: Contrast
		},
		{
			name: 'Accessibility',
			component: Accessibility
		},
		{
			name: 'Baby',
			component: Baby
		},
		{
			name: 'LifeBuoy',
			component: LifeBuoy
		},
		{
			name: 'Moon',
			component: Moon
		},
		{
			name: 'Orbit',
			component: Orbit
		},
		{
			name: 'Star',
			component: Star
		},
		{
			name: 'Circle',
			component: Circle
		},
		{
			name: 'Bird',
			component: Bird
		},
		{
			name: 'Bone',
			component: Bone
		},
		{
			name: 'Dog',
			component: Dog
		},
		{
			name: 'Cat',
			component: Cat
		},
		{
			name: 'Fish',
			component: Fish
		},
		{
			name: 'Chrome',
			component: Chrome
		},
		{
			name: 'Dribbble',
			component: Dribbble
		},
		{
			name: 'Github',
			component: Github
		},
		{
			name: 'Building',
			component: Building
		},
		{
			name: 'Building2',
			component: Building2
		},
		{
			name: 'Castle',
			component: Castle
		},
		{
			name: 'Church',
			component: Church
		},
		{
			name: 'Factory',
			component: Factory
		},
		{
			name: 'GraduationCap',
			component: GraduationCap
		},
		{
			name: 'Hotel',
			component: Hotel
		},
		{
			name: 'Landmark',
			component: Landmark
		},
		{
			name: 'School',
			component: School
		},
		{
			name: 'Store',
			component: Store
		},
		{
			name: 'UtilityPole',
			component: UtilityPole
		},
		{
			name: 'Warehouse',
			component: Warehouse
		},
		{
			name: 'Wand',
			component: Wand
		},
		{
			name: 'Apple',
			component: Apple
		},
		{
			name: 'Banana',
			component: Banana
		},
		{
			name: 'Trees',
			component: Trees
		},
		{
			name: 'Activity',
			component: Activity
		},
		{
			name: 'Atom',
			component: Atom
		}
	];

	$: filteredIcons = chunk(
		icons.filter((icon) => {
			if (searchValue) {
				return icon.name.toLowerCase().includes(searchValue.toLowerCase());
			}
			return true;
		}),
		8 // (w-72 / width of icons)
	);

	// TODO: should these match with tag color?
	const iconColors = [
		{
			label: 'Light Gray',
			value: '#c7bcbc'
		},
		{
			label: 'Dark Gray',
			value: '#333333'
		},
		{
			label: 'Stone Red',
			value: '#A93226'
		},
		{
			label: 'Blue',
			value: '#3b82f6'
		},
		{
			label: 'Mint Green',
			value: '#2EC4B6'
		},
		{
			label: 'Lavender',
			value: '#D3B8FF'
		},
		{
			label: 'Cherry Red',
			value: '#E63946'
		},
		{
			label: 'Leafy Green',
			value: '#6EE7B7'
		},
		{
			label: 'Sunny Yellow',
			value: '#FFD166'
		}
	] as const;

	let hexInput: HTMLInputElement;
	let searchValue = '';
	let activeRow = -1;
	let activeColumn = 0;
	export let activeColor: string = colors[0].value;
	let showHexCodeEntry = false;
	let open = false;

	let rowToLastColumnFocused = new Map<number, number>();
	rowToLastColumnFocused.set(0, 0);

	function selectIcon(icon: string) {
		activeIcon = icon;
		open = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		// handle arrow keys
		if (
			!(
				e.key === 'ArrowDown' ||
				e.key === 'ArrowUp' ||
				e.key === 'ArrowLeft' ||
				e.key === 'ArrowRight' ||
				e.key === 'Enter'
			)
		) {
			return;
			// const lastColumnFocused = rowToLastColumnFocused.get(activeRow);
			// if (lastColumnFocused !== undefined) {
			//     activeColumn = lastColumnFocused;
			// }
			console.log({ activeRow, activeColumn });
			console.log({ rowToLastColumnFocused });
		}
		if (e.key === 'ArrowDown') {
			console.log({ activeRow, activeColumn, icons });
			activeRow = Math.min(activeRow + 1, filteredIcons.length - 1);
			const rowIcons = filteredIcons[activeRow];
			if (rowIcons) {
				activeColumn = Math.min(activeColumn, rowIcons.length - 1);
			}
			console.log({ activeRow, activeColumn });
		} else if (e.key === 'ArrowUp') {
			const oldRowLength = filteredIcons[activeRow]?.length;
			activeRow = Math.max(activeRow - 1, 0);
			const newRowLength = filteredIcons[activeRow]?.length;
			const lastActiveColumn = rowToLastColumnFocused.get(activeRow);
			if (lastActiveColumn !== undefined && newRowLength !== oldRowLength) {
				activeColumn = lastActiveColumn;
			}
		} else if (e.key === 'ArrowLeft') {
			activeColumn = Math.max(activeColumn - 1, 0);
		} else if (e.key === 'ArrowRight') {
			const rowLength = filteredIcons[activeRow]?.length;
			if (rowLength !== undefined) {
				activeColumn = Math.min(activeColumn + 1, rowLength - 1);
			}
		} else if (e.key === 'Enter') {
			const icon = filteredIcons[activeRow]?.[activeColumn];
			if (icon) {
				selectIcon(icon.name);
			}
		}
		rowToLastColumnFocused.set(activeRow, activeColumn);
	}

	$: if (showHexCodeEntry) {
		hexInput?.focus();
		hexInput?.setSelectionRange(1, activeColor.length);
	} else {
	}

	$: if (!activeColor.startsWith('#')) {
		activeColor = `#${activeColor}`;
	}

	$: {
		if (activeColor.length > 9) {
			activeColor = activeColor.slice(0, 9);
		}
		if (!hexCodeRegexWithoutHash.test(activeColor)) {
			console.log('invalid hex code');
			activeColor = '#' + activeColor.replace(/[^0-9a-fA-F]/gi, '');
			//    activeColor = activeColor.replace()
		}
	}
</script>

<Popover.Root
	bind:open
	positioning={{
		placement: 'bottom-start'
	}}
	onOpenChange={() => {
		searchValue = '';
		activeRow = -1;
		activeColumn = 0;
	}}
>
	<Popover.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]} class={cn('h-12 w-12', className)}>
			<svelte:component
				this={icons.find((icon) => icon.name === activeIcon)?.component}
				data-color-hex={activeColor}
				class="h-8 w-8 shrink-0 opacity-75 text-[--color]"
				style="--color:{activeColor}"
			/>
			<span class="sr-only">Icon Picker</span>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-72 p-1.5 pt-4 ">
		<div class="flex flex-col gap-2">
			<div class="relative order-2">
				<input
					placeholder="Search icons…"
					class="appearance-none peer w-full bg-secondary rounded-sm text-sm px-7 py-0.5"
					on:keydown={handleKeydown}
					on:input={() => {
						activeRow = 0;
						activeColumn = 0;
					}}
					type="text"
					bind:value={searchValue}
				/>
				<SearchIcon
					class="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 opacity-50 peer-focus:opacity-100 transition-opacity"
				/>
			</div>
			<div
				class="flex justify-between gap-1 flex-1 h-full px-2 order-1 overflow-hidden py-1 relative"
			>
				<div
					class={cn(
						'-translate-y-10 absolute grow w-full text-sm text-muted-foreground font-mono transition',
						showHexCodeEntry && 'translate-y-0'
					)}
				>
					<input
						bind:this={hexInput}
						bind:value={activeColor}
						placeholder="Hex"
						class={cn(
							"-translate-y-10 absolute grow w-full transition before:content-['#'] pr-7",
							showHexCodeEntry && 'translate-y-0'
						)}
						type="text"
					/>
				</div>
				<div class="flex justify-between gap-1 flex-1 h-full">
					{#each colors.slice(0, 8) as color}
						{@const checked = color.value === activeColor}
						<button
							on:click={() => {
								activeColor = color.value;
							}}
							style:--color={color.value}
							class={cn(
								'w-6 h-6 rounded-full transition flex items-center justify-center shrink-0 bg-[--color] focus:ring-1 focus-visible:shadow-md shadow-[--color] focus:ring-offset-2 ring-[--color] ring-offset-background focus-visible:outline-none appearance-none',
								showHexCodeEntry && 'translate-y-10'
							)}
						>
							<!--  -->
							{#if checked}
								<CheckIcon class="h-2.5 w-2.5 text-black" />
							{/if}
						</button>
					{/each}
				</div>
				<Button
					on:click={() => (showHexCodeEntry = !showHexCodeEntry)}
					variant="outline"
					size="sm"
					class={cn(
						'items-center justify-center h-[26px] w-[26px] shrink-0 relative transition-all rounded-sm',
						showHexCodeEntry && 'rounded-full overflow-hidden'
					)}
				>
					<span class="sr-only"> Enter Hex Code </span>
					<HashIcon class="h-3 w-3 text-muted-foreground absolute inset-0 mx-auto my-auto" />
					<div
						class={cn(
							'absolute inset-px rounded-full transition-all',
							showHexCodeEntry ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
						)}
						style={styleToString({
							background: `conic-gradient(${iconColors
								.slice(1, 7)
								.map((color) => color.value)
								.join(', ')})`
						})}
					/>
				</Button>
			</div>
			<div class="px-1 order-3" data-active-color={activeColor} style:--icon-color={activeColor}>
				<!-- TODO: accessibility on this -->
				{#each filteredIcons as row, rowIndex}
					<div
						class={cn(
							'flex gap-1.5'
							// full row length should be 8
							// row.length === 8 && "justify-between"
						)}
						data-row={rowIndex}
					>
						{#each row as icon, columnIndex}
							<button
								tabindex={-1}
								data-active={activeRow === rowIndex && activeColumn === columnIndex}
								data-row={rowIndex}
								data-column={columnIndex}
								on:click={() => selectIcon(icon.name)}
								class="items-center p-1.5 inline-flex justify-center rounded font-medium w-7 data-[active=true]:bg-accent group"
							>
								<svelte:component
                                    data-color-hex={activeColor}
									this={icon.component}
									class="h-5 w-5 opacity-75 text-[--icon-color] group-hover:opacity-100 group-data-[active=true]:opacity-100 transition shrink-0"
								/>
								<span class="sr-only">{icon.name}</span>
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</Popover.Content>
</Popover.Root>

<style>
	[data-color-hex] {
		color: var(--color);
	}

	:global(.dark) {
		[data-color-hex='#000000'],
		[data-color-hex='#000'] {
			color: #ffffff;
		}
	}

	@media (prefers-color-scheme: dark) {
		[data-color-hex='#000000'],
		[data-color-hex='#000'] {
			color: #ffffff;
		}
	}
</style>
