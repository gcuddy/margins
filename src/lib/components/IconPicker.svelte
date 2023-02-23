<script lang="ts">
	import type { IconName } from "$lib/icons";
	import { colors } from "$lib/types/colors";
	import type { ChosenIcon } from "$lib/types/icon";
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
		Tab,
		TabGroup,
		TabList,
		TabPanel,
		TabPanels,
	} from "@rgossiaux/svelte-headlessui";
	import { createEventDispatcher } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import SmallPlus from "./atoms/SmallPlus.svelte";
	import ColorSwatch from "./ColorSwatch.svelte";
	import EmojiPicker from "./EmojiPicker.svelte";
	import Icon from "./helpers/Icon.svelte";
	const [popperRef, popperContent] = createPopperActions();
	const popperOptions = {
		placement: "bottom-start",
		strategy: "absolute",
		modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
	};
    const dispatch = createEventDispatcher<{
        choose: ChosenIcon;
    }>();

	// TODO: fill out (maybe from lucide.dev) with about 126
	const iconsToChooseFrom: IconName[] = [
		"rectangleStackMini",
		"academicCapMini",
		"moonMini",
		"beakerMini",
		"bellMini",
		"boltMini",
		"bookOpenMini",
		"bookmarkMini",
		"briefcaseMini",
		"buildingLibraryMini",
		"buildingOfficeMini",
		"cakeMini",
		"calculatorMini",
		"calendarMini",
		"cameraMini",
		"chartBarMini",
		"circleStackMini",
		"clipboardMini",
		"commandLineMini",
		"computerDesktopMini",
		"cpuChipMini",
		"creditCardMini",
		"cubeMini",
		"documentMini",
		"envelopeMini",
		"eyeDropperMini",
		"filmMini",
		"fireMini",
		"flagMini",
		"globeAmericasMini",
		"globeAsiaAustraliaMini",
		"globeEuropeAfricaMini",
		"heartMini",
		"inboxMini",
		"informationCircleMini",
		"languageMini",
		"lightBulbMini",
		"mapMini",
		"musicalNoteMini",
		"newspaperMini",
		"paintBrushMini",
		"photoMini",
		"radioMini",
		"rocketLaunchMini",
		"sunMini",
		"swatchMini",
		"ticketMini",
		"trophyMini",
		"truckMini",
		"tvMini",
	];
	const convertIconToLabel = (icon: IconName) => {
		return icon
			.replace(/(Solid|Mini)$/, "")
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase());
	};


    const defaultChosenIcon: ChosenIcon = {
        name: "rectangleStackMini",
        color: "#fbbf24",
        type: "icon",
    }

	export let chosenIcon: ChosenIcon = {
		name: "rectangleStackMini",
		color: "#fbbf24",
		type: "icon",
	};
    $: chosenIcon = chosenIcon || defaultChosenIcon;

    export let iconClass = "h-4 w-4 fill-current";
</script>

<!-- palette popver (possibly split into its own component) -->

<Popover class="h-full w-full">
	<PopoverButton
		use={[popperRef]}
		class="flex h-full w-full items-center justify-center rounded-lg border border-border px-2 transition"
		style={chosenIcon.type === "icon" ? `color: ${chosenIcon.color};` : undefined}
	>
		{#if chosenIcon.type === "icon"}
			<Icon name={chosenIcon.name} className={iconClass} />
		{:else if chosenIcon.type === "emoji"}
			<div>
				{chosenIcon.emoji}
			</div>
		{/if}
	</PopoverButton>

	<PopoverPanel class="z-10" use={[[popperContent, popperOptions]]} let:close>
		<div class="w-96 rounded border border-gray-700 bg-gray-900 text-gray-100 shadow-lg">
			<TabGroup class="divide-y divide-gray-700">
				<TabList class="flex w-full px-2">
					<Tab
						class={({ selected }) =>
							`px-2 py-3  ${selected ? "border-b border-primary-300" : "text-gray-600 dark:text-gray-500"}`}
						><SmallPlus>Icons</SmallPlus></Tab
					>
					<Tab
						class={({ selected }) =>
							`px-2 py-3  ${selected ? "border-b border-primary-300" : "text-gray-600 dark:text-gray-500"}`}
						><SmallPlus>Emoji</SmallPlus></Tab
					>
					<Tab
						class={({ selected }) =>
							`px-2 py-3  ${selected ? "border-b border-primary-300" : "text-gray-600 dark:text-gray-500"}`}
						><SmallPlus>Image</SmallPlus></Tab
					>
				</TabList>
				<TabPanels>
					<TabPanel>
						<div class="p-2">
							<div class="flex px-2 py-4">
								{#each Object.entries(colors) as [color, hex]}
									<ColorSwatch
										on:click={(e) => {
											e.preventDefault();
											chosenIcon.color = hex;
										}}
										{color}
										{hex}
									/>
								{/each}
							</div>
							<div
								style:color={chosenIcon.type === "icon" ? chosenIcon.color : undefined}
								class="flex flex-row flex-wrap"
							>
								{#each iconsToChooseFrom as icon}
									<button
										on:click|preventDefault={() => {
											chosenIcon.type = "icon";
											if (chosenIcon.type === "icon") {
												chosenIcon.name = icon;
											}
											close();
                                            dispatch("choose", chosenIcon)
										}}
										aria-label={convertIconToLabel(icon)}
										class="group flex cursor-default items-center rounded bg-transparent p-1.5 transition-text-color duration-150 ease-in-out hover:bg-gray-500 dark:hover:bg-gray-700"
									>
										<Icon name={icon} className="w-4 h-4 fill-current group-hover:fill-amber-50" />
									</button>
								{/each}
							</div>
						</div>
					</TabPanel>
					<TabPanel
						><EmojiPicker
							on:change={(e) => {
								chosenIcon.type = "emoji";
								if (chosenIcon.type === "emoji") {
									chosenIcon.emoji = e.detail.emoji;
									chosenIcon.hexcode = e.detail.hexcode;
									chosenIcon.label = e.detail.label;
								}

								close();
                                dispatch("choose", chosenIcon)
							}}
						/></TabPanel
					>
					<TabPanel>image upload or choose thumbnail</TabPanel>
				</TabPanels>
			</TabGroup>
		</div>
	</PopoverPanel>
</Popover>
