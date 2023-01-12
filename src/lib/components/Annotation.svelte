<script lang="ts">
	import { browser } from "$app/environment";
	import { invalidateAll } from "$app/navigation";
	import dayjs from "$lib/dayjs";
	import { createRelativeDateStore } from "$lib/stores/relativeDate";
	import { trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { TextQuoteTarget } from "$lib/types/schemas/Annotations";
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { createEventDispatcher } from "svelte";
	import { match } from "ts-pattern";
	import AnnotationWrapper from "./annotations/AnnotationWrapper.svelte";
	import Muted from "./atoms/Muted.svelte";
	import SmallPlus from "./atoms/SmallPlus.svelte";
	import DotMenu from "./DotMenu.svelte";
	import Icon from "./helpers/Icon.svelte";
	import { page } from "$app/stores";
	import AnnotationInput from "./annotations/AnnotationInput.svelte";
	import { enhance } from "$app/forms";
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		Menu,
		MenuButton,
		MenuItems,
		MenuItem,
	} from "@rgossiaux/svelte-headlessui";
	import { createPopperActions } from "svelte-popperjs";

	const [menuref, menucontent] = createPopperActions({
		placement: "bottom-end",
	});

	export let annotation: RouterOutputs["entries"]["load"]["annotations"][number];
	$: console.log({ annotation });
	export let scrollOnClick = false;

	const dispatch = createEventDispatcher();

	let editing = false;
	let replying = false;

	export let onEdit = () => {
		editing = true;
	};

	// REVIEW: should this be reactive? (in case annotation.createdAt is changed (tho it shouldn't be, right?))
	// TODO: (edited) if it's been edited (i.e. don't think updated != created is sufficient, think we'd need to add some middleware to check when body is updated and then mark an edited boolean on the model itself)
	const date = createRelativeDateStore(annotation.createdAt);

	let busy = false;

	$: target = match(TextQuoteTarget.safeParse(annotation.target))
		.with(
			{
				success: true,
			},
			({ data }) => data
		)
		.with(
			{
				success: false,
			},
			() => null
		)
		.exhaustive();
	$: console.log({ target });
	$: text = target && target.selector.exact;
	$: color = annotation.color?.color || `rgb(252 211 77)`;

	$: console.log({ annotation });

	// expandable means it's big enough to have a more button
	let expandable = false;
	let more = false;
	let content: HTMLElement | undefined = undefined;
	let clampedSize = 80;
	const maxHeight = tweened(clampedSize, {
		duration: 150,
	});

	let children_promise = fetchChildren();

	function fetchChildren() {
		if (browser) {
			return trpc().annotations.loadReplies.query({
				id: annotation.id,
			});
		}
	}
	async function invalidateAnnotations() {
		await invalidateAll();
		await invalidateChildren();
	}

	function invalidateChildren() {
		children_promise = fetchChildren();
	}

	$: if (more) {
		// we select the first element child, as it has the correct height on it
		const rect = content?.firstElementChild?.getBoundingClientRect();
		const height = rect?.height || 400;
		console.log({ height });
		maxHeight.set(height);
	} else {
		maxHeight.set(clampedSize);
	}

	onMount(() => {
		if (browser && window && content) {
			const height = content.firstElementChild?.getBoundingClientRect()?.height;
			if (!height || height < 40) {
				expandable = false;
				return;
			}
			expandable = true;
			const lineHeight = parseInt(window.getComputedStyle(content).lineHeight);
			clampedSize = Math.min(lineHeight * 4, height);
			maxHeight.set(clampedSize, {
				duration: 0,
			});
		}
	});
</script>

<!-- REVIEW: for some reason, animate-pulse not working, but can't tell if this is issue that will go away -->
{#if editing}
	<AnnotationInput on:cancel={() => (editing = false)} value={annotation.body?.toString() || ""} />
{:else}
	<div
		class="annotation-input not-prose relative flex max-w-md resize scroll-mt-12 flex-col items-start gap-2.5 rounded-lg  border border-gray-200   bg-white px-4 py-3 font-sans font-medium shadow transition   transparency:bg-gray-50/90 transparency:backdrop-blur-xl transparency:backdrop-brightness-125 transparency:backdrop-saturate-200 dark:border-0 dark:bg-gray-800  dark:ring-1  dark:ring-gray-400/10   transparency:dark:bg-gray-800 {busy
			? 'opacity-50'
			: ''}"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		{#if !annotation.deleted}
			<div
				class="flex w-full flex-col gap-2"
				style:--annotation-color={color}
				on:click={() => {
					if (!scrollOnClick) return;
					document.querySelector(`[data-annotation-id="${annotation.id}"]`)?.scrollIntoView({
						block: "center",
						inline: "start",
						behavior: "smooth",
					});
				}}
			>
				<div class="flex items-center justify-between">
					<div>
						<SmallPlus
							><a on:click|stopPropagation href="/u:{annotation.creator.username}"
								>{annotation.creator.username}</a
							></SmallPlus
						>
						<Muted class="text-xs">
							<time datetime={dayjs(annotation.createdAt).format()}>{$date}</time>
							{annotation.editedAt ? "(edited)" : ""}
						</Muted>
					</div>
					<div class="flex items-center gap-1">
						<Icon
							name={annotation.private ? "lockClosedMini" : "lockOpenMini"}
							className="h-3 w-3 fill-gray-400"
						/>
						<Menu let:open>
							<MenuButton
								use={[menuref]}
								class="flex items-center rounded-md p-1 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:active:text-white {open
									? 'bg-gray-200 dark:bg-gray-600'
									: ''}"
							>
								<Icon name="ellipsisHorizontalMini" className="h-4 w-4 fill-gray-600 dark:fill-gray-300" />
							</MenuButton>
							<MenuItems
								use={[menucontent]}
								class="relative z-30 flex w-56 origin-top-right scale-100 transform flex-col gap-y-2 divide-y divide-gray-100 rounded-md bg-gray-50/90 py-1 opacity-100 shadow-xl ring-1 ring-black/5 backdrop-blur-sm  focus:outline-none dark:divide-gray-700 dark:bg-stone-800 dark:text-current dark:ring-gray-400/20 dark:backdrop-blur-md dark:backdrop-brightness-75 dark:backdrop-contrast-75 dark:backdrop-saturate-200"
							>
								{#if annotation.creator.username === $page.data.user?.username}
									<div class="px-1">
										<MenuItem
											class={({ active }) =>
												`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
													active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
												}`}
											on:click={() => {
												editing = true;
											}}
											let:active
										>
											<Icon
												name="pencilMini"
												className="h-4 w-4 dark:fill-gray-400 fill-gray-500 {active
													? 'fill-gray-600 dark:fill-gray-300'
													: ''}"
											/>
											<span>Edit</span>
										</MenuItem>
										<MenuItem
											class={({ active }) =>
												`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
													active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
												}`}
											on:click={async () => {
												busy = true;
												await trpc().annotations.update.mutate({
													id: annotation.id,
													data: {
														private: !annotation.private,
													},
												});
												await invalidateAnnotations();
												busy = false;
											}}
											let:active
										>
											<Icon
												name={annotation.private ? "lockOpenMini" : "lockClosedMini"}
												className="h-4 w-4 dark:fill-gray-400 fill-gray-500 {active
													? 'fill-gray-600 dark:fill-gray-300'
													: ''}"
											/>
											<span>Make {annotation.private ? "Public" : "Private"}</span>
										</MenuItem>
										<MenuItem
											class={({ active }) =>
												`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
													active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
												}`}
											on:click={async () => {
												busy = true;
												await trpc().annotations.delete.mutate(annotation.id);
												await invalidateAnnotations();
												busy = false;
											}}
											let:active
										>
											<Icon
												name="trashMini"
												className="h-4 w-4 dark:fill-gray-400 fill-gray-500 {active
													? 'fill-gray-600 dark:fill-gray-300'
													: ''}"
											/>
											<span>Delete</span>
										</MenuItem>
									</div>
								{/if}
								<div class="px-1 pt-1">
									<MenuItem
										class={({ active }) =>
											`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
												active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
											}`}
										on:click={() => (replying = true)}
										let:active
									>
										<Icon
											name="replySolid"
											className="h-4 w-4 dark:fill-gray-400 fill-gray-500 {active
												? 'fill-gray-600 dark:fill-gray-300'
												: ''}"
										/>
										<span>Reply</span>
									</MenuItem>
									<MenuItem
										class={({ active }) =>
											`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
												active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
											}`}
										on:click={() => {
											//TODO
										}}
										let:active
									>
										<Icon
											name="linkMini"
											className="h-4 w-4 dark:fill-gray-400 fill-gray-500 {active
												? 'fill-gray-600 dark:fill-gray-300'
												: ''}"
										/>
										<span>Copy link</span>
									</MenuItem>
								</div>
							</MenuItems>
						</Menu>
					</div>
				</div>
				{#if target}
					<div class="grid-row-1 grid grid-cols-12">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => {
								if (!more && expandable) more = true;
							}}
							bind:this={content}
							style:max-height="{$maxHeight}px"
							class="relative col-start-1 col-end-13 row-start-1 row-end-1 overflow-hidden border-l border-[var(--annotation-color)] px-3 font-normal italic transition {!more
								? 'gradient-mask-br-50'
								: ''}"
						>
							<!-- REVIEW: should we display html or text here? -->
							<div class="pointer-events-none">
								{@html target?.html || text}
							</div>
						</div>
						{#if expandable}
							<button
								on:click|stopPropagation
								class="z-10 col-start-12 row-start-1 row-end-1 cursor-default place-self-end pl-4  font-semibold text-primary-600 backdrop-opacity-50  "
								on:click={() => (more = !more)}>{more ? "Less" : "More"}</button
							>
						{/if}
					</div>
				{/if}
				<div class="font-normal">{annotation.body}</div>
			</div>
		{:else}
			<div>Annotation deleted</div>
		{/if}
		{#if annotation._count.children}
			{@const count = annotation._count.children}
			<!-- TODO: on click load replies -->
			<!-- TODO: progressively enhance by having this be a link to dedicated entry/annotations page -->
			<Disclosure class="w-full space-y-2">
				<DisclosureButton
					on:click={() => {
						if (annotation.children) return;
					}}
				>
					{count} repl{count > 1 ? "ies" : "y"}
				</DisclosureButton>
				<DisclosurePanel class="flex w-full flex-col gap-2 border-l border-gray-500/50 pl-2">
					{#if annotation.children}
						{#each annotation.children as child}
							<svelte:self annotation={child} />
						{/each}
					{:else if children_promise}
						{#await children_promise}
							loading
						{:then children}
							{#each children as child}
								<svelte:self annotation={child} />
							{/each}
						{/await}
						<!-- fetch children -->
					{/if}
				</DisclosurePanel>
			</Disclosure>
		{/if}
		{#if replying}
			<div class="ml-3 w-full border-l border-gray-500/25 pl-2">
				<form
					action="/annotations?/reply"
					method="post"
					use:enhance={() => {
						return ({ update }) => {
							update().then(() => (replying = false));
						};
					}}
				>
					<input type="hidden" name="id" value={annotation.id} />
					<AnnotationInput name="body" />
				</form>
			</div>
		{/if}
	</div>
{/if}
