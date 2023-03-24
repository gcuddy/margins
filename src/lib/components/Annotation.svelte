<script lang="ts">
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import dayjs from "$lib/dayjs";
	import { updateAnnotationMutation } from "$lib/features/annotations/mutations";
	import { iconsMini } from "$lib/features/entries/utils";
	import type { ContextualAnnotation } from "$lib/prisma/selects/annotations";
	import { modals } from "$lib/stores/modals";
	import { createRelativeDateStore } from "$lib/stores/relativeDate";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { TextQuoteTarget } from "$lib/types/schemas/Annotations";
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
		Portal,
	} from "@rgossiaux/svelte-headlessui";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import { createEventDispatcher, onMount } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { tweened } from "svelte/motion";
	import { match } from "ts-pattern";
	import AnnotationInput from "./annotations/AnnotationInput.svelte";
	import Muted from "./atoms/Muted.svelte";
	import SmallPlus from "./atoms/SmallPlus.svelte";
	import ConfirmModal from "./ConfirmModal.svelte";
	import ConfirmModalContent from "./ConfirmModalContent.svelte";
	import Icon from "./helpers/Icon.svelte";
	import TagCloud from "./TagCloud.svelte";
	import { genHtml } from "./TipTap.svelte";

	const [menuref, menucontent] = createPopperActions({
		placement: "bottom-end",
	});

	type TAnnotation = $$Generic<
		RouterOutputs["entries"]["getAnnotations"][number]
	>;
	export let annotation: TAnnotation;
	//todo: type target/selector better
	export let shadowInner = false;
	export let scrollOnClick = false;
	export let showParent = false;
	export let isParent = false;
	export let showEntry = false;
	export let scrollIntoView = false;

	export let selected = false;

	let display_parent = false;

	$: console.log({ annotation });

	const dispatch = createEventDispatcher<{
		seek: number;
		delete: TAnnotation;
	}>();
	const queryClient = useQueryClient();

	type Entry = RouterOutputs["entries"]["load"];
	const updateAnnotation = createMutation({
		...updateAnnotationMutation(),
		onMutate: async () => {
			// TODO: get correct context
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["annotations", { id: annotation.id }],
			});
			queryClient.invalidateQueries({
				queryKey: ["entries", "details", { id: annotation.entryId }],
			});
		},
	});

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
	$: text = target && target.selector.exact;
	$: color = annotation.color || `rgb(252 211 77)`;

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

	const client = trpcWithQuery($page);
	const utils = client.createContext();

	const deleteAnnotation = client.annotations.delete.createMutation({
		// TODO
		// onMutate
		onMutate: () => {
			// TODO: cancel refetches
			// TODO: capture the previous value
			//    const previous = utils.entries.load
		},
		onSuccess: () => {
			// TODO: More invlaidations
			if (annotation.entryId)
				utils.entries.load.invalidate({
					id: annotation.entryId,
				});
		},
	});

	onMount(() => {
		if (wrapper) {
			scrollIntoView && wrapper.scrollIntoView();
		}
		if (browser && window && content) {
			const height = content.firstElementChild?.getBoundingClientRect()?.height;
			console.log({ height });
			if (!height) {
				expandable = false;
				return;
			}
			const lineHeight = parseInt(window.getComputedStyle(content).lineHeight);
			clampedSize = Math.min(lineHeight * 4, height);
			if (clampedSize >= height) {
				expandable = false;
				return;
			}
			console.log({ clampedSize, lineHeight, height });
			expandable = true;
			maxHeight.set(clampedSize, {
				duration: 0,
			});
		}
	});

	let saving = false;
	let wrapper: HTMLElement;
</script>

<!-- REVIEW: for some reason, animate-pulse not working, but can't tell if this is issue that will go away -->
<div bind:this={wrapper}>
	{#if editing}
		<!-- TODO -->
		<form
			action="/annotations/{annotation.id}?/update"
			method="post"
			use:enhance={() => {
				console.log("saving");
				saving = true;
				return async ({ update }) => {
					await update({
						reset: false,
					});
					saving = false;
					editing = false;
				};
			}}
		>
			<AnnotationInput
				name="body"
				{saving}
				rows={2}
				on:cancel={() => (editing = false)}
				value={annotation.body?.toString() || ""}
				confirmButtonStyle="ghost"
				class="text-sm"
			/>
		</form>
	{:else}
		<div
			class="annotation-input {'parent' in annotation
				? ''
				: ''} not-prose relative flex max-w-md resize scroll-mt-12 flex-col items-start gap-2.5 rounded-lg border border-border bg-elevation px-4 py-3 font-sans font-medium {shadowInner
				? 'shadow-inner'
				: 'shadow'} transition transparency:bg-elevation/90 transparency:backdrop-blur-xl transparency:backdrop-brightness-125 transparency:backdrop-saturate-200 {busy
				? 'opacity-50'
				: ''} {isParent ? 'w-full' : ''}"
		>
			{#if display_parent && "parent" in annotation && annotation.parent}
				<svelte:self
					isParent={true}
					annotation={annotation.parent}
					shadowInner={true}
				/>
			{/if}
			<div
				class="flex w-full flex-col gap-2 {'parent' in annotation &&
				annotation.parent
					? 'border-l border-gray-500/25 pl-3'
					: ''}"
			>
				{#if !annotation.deleted}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="flex w-full flex-col gap-2"
						style:--annotation-color={color}
						on:click={() => {
							if (!scrollOnClick) return;
							document
								.querySelector(`[data-annotation-id="${annotation.id}"]`)
								?.scrollIntoView({
									block: "center",
									inline: "start",
									behavior: "smooth",
								});
						}}
					>
						<div class="flex items-center justify-between">
							<div>
								<SmallPlus
									><a on:click|stopPropagation href="/u:{annotation.username}"
										>{annotation.username}</a
									></SmallPlus
								>
								<Muted class="text-xs">
									<time datetime={dayjs(annotation.createdAt).format()}
										>{$date}</time
									>
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
										on:click={(e) => e.stopPropagation()}
										use={[menuref]}
										class="flex items-center rounded-md p-1 focus:bg-gray-200 hover:bg-gray-200 dark:focus:bg-gray-600 dark:hover:bg-gray-600 dark:active:text-white {open
											? 'bg-gray-200 dark:bg-gray-600'
											: ''}"
									>
										<Icon
											name="ellipsisHorizontalMini"
											className="h-4 w-4 fill-bright dark:fill-gray-300"
										/>
									</MenuButton>
									<Portal>
										<MenuItems
											use={[menucontent]}
											class="relative z-30 flex w-56 origin-top-right scale-100 transform flex-col gap-y-2 divide-y divide-border rounded-md bg-elevation/50 py-1 opacity-100 shadow-2xl ring-1  ring-border backdrop-blur-md backdrop-brightness-75 backdrop-contrast-75 backdrop-saturate-200  focus:outline-none dark:divide-gray-700 dark:bg-stone-800 dark:text-current dark:ring-gray-400/20 dark:backdrop-blur-md dark:backdrop-brightness-75 dark:backdrop-contrast-75 dark:backdrop-saturate-200"
										>
											{#if annotation.creator.username === $page.data.user?.username}
												<div class="px-1">
													<MenuItem
														class={({ active }) =>
															`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-content dark:text-gray-50 ${
																active
																	? "bg-elevation-hover dark:bg-gray-500/20"
																	: ""
															}`}
														on:click={() => {
															editing = true;
														}}
														let:active
														as="div"
													>
														<Icon
															name="pencilMini"
															className="h-4 w-4  {active
																? 'fill-bright '
																: 'fill-muted'}"
														/>
														<span>Edit</span>
													</MenuItem>
													<MenuItem
														class={({ active }) =>
															`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-content dark:text-gray-50 ${
																active
																	? "bg-elevation-hover dark:bg-gray-500/20"
																	: ""
															}`}
														on:click={async () => {
															busy = true;
															await trpc().annotations.save.mutate({
																id: annotation.id,
																private: !annotation.private,
															});
															await invalidateAnnotations();
															busy = false;
														}}
														let:active
														as="div"
													>
														<Icon
															name={annotation.private
																? "lockOpenMini"
																: "lockClosedMini"}
															className="h-4 w-4  {active
																? 'fill-bright '
																: 'fill-muted'}"
														/>
														<span
															>Make {annotation.private
																? "Public"
																: "Private"}</span
														>
													</MenuItem>
													<MenuItem
														class={({ active }) =>
															`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-content dark:text-gray-50 ${
																active
																	? "bg-elevation-hover dark:bg-gray-500/20"
																	: ""
															}`}
														on:click={async () => {
															$updateAnnotation.mutate({
																id: annotation.id,
																type: "note",
															});
															// busy = true;
															// await trpc().annotations.save.mutate({
															// 	id: annotation.id,
															// 	private: !annotation.private,
															// });
															// await invalidateAnnotations();
															// busy = false;
														}}
														let:active
														as="div"
													>
														<Icon
															name="documentText"
															className="h-4 w-4  {active
																? 'fill-bright '
																: 'fill-muted'}"
														/>
														<span>Convert to page note</span>
													</MenuItem>
													<MenuItem
														class={({ active }) =>
															`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-content dark:text-gray-50 ${
																active
																	? "bg-elevation-hover dark:bg-gray-500/20"
																	: ""
															}`}
														on:click={async () => {
															modals.open(
																ConfirmModalContent,
																{
																	title:
																		"Are you sure you want to delete this annotation?",
																	description: "This action cannot be undone.",
																	onConfirm: () => {
																		dispatch("delete", annotation);
																		$deleteAnnotation.mutate(annotation.id);
																		// busy = true;
																		// trpc().annotations.delete.mutate(annotation.id);
																		// invalidateAnnotations();
																		// busy = false;
																	},
																},
																"confirm-annotation",
																{
																	maxWidth: "max-w-md",
																}
															);
															// busy = true;
															// await trpc().annotations.delete.mutate(annotation.id);
															// await invalidateAnnotations();
															// busy = false;
														}}
														let:active
														as="div"
													>
														<Icon
															name="trashMini"
															className="h-4 w-4  {active
																? 'fill-bright '
																: 'fill-muted'}"
														/>
														<span>Delete</span>
													</MenuItem>
												</div>
											{/if}
											<div class="px-1 pt-1">
												<MenuItem
													class={({ active }) =>
														`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-content dark:text-gray-50 ${
															active
																? "bg-elevation-hover dark:bg-gray-500/20"
																: ""
														}`}
													on:click={() => (replying = true)}
													as="div"
													let:active
												>
													<Icon
														name="replySolid"
														className="h-4 w-4  {active
															? 'fill-bright '
															: 'fill-muted'}"
													/>
													<span>Reply</span>
												</MenuItem>
												<MenuItem
													as="div"
													class={({ active }) =>
														`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-content dark:text-gray-50 ${
															active
																? "bg-elevation-hover dark:bg-gray-500/20"
																: ""
														}`}
													on:click={() => {
														//TODO
													}}
													let:active
												>
													<Icon
														name="linkMini"
														className="h-4 w-4  {active
															? 'fill-bright '
															: 'fill-muted'}"
													/>
													<span>Copy link</span>
												</MenuItem>
											</div>
										</MenuItems>
									</Portal>
								</Menu>
							</div>
						</div>
						{#if "entry" in annotation && showEntry && annotation.entry}
							<Muted class="text-sm italic">
								<a
									class="flex items-center space-x-2"
									href="/u:{$page.data.user?.username}/entry/{annotation.entry
										.id}"
								>
									{#if annotation.entry.type}
										<Icon
											name={iconsMini[annotation.entry.type]}
											className="h-3 w-3 fill-current"
										/>
										<!-- <Icon /> -->
									{/if}
									<SmallPlus>{annotation.entry.title}</SmallPlus></a
								></Muted
							>
						{/if}
						{#if "parent" in annotation && showParent && annotation.parent}
							<button
								class="max-w-max"
								on:click={() => (display_parent = !display_parent)}
								><span>Replying to {annotation.parent.creator.username}</span
								></button
							>
						{/if}
						{#if target}
							<!-- href="/u:{$page.data.user?.username}/entry/{annotation.entryId}?a={annotation.id}" -->
							<div class="grid-row-1 grid grid-cols-12">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									on:click={() => {
										if (!more && expandable) more = true;
									}}
									bind:this={content}
									style:max-height="{$maxHeight}px"
									class="relative col-start-1 col-end-13 row-start-1 row-end-1 overflow-hidden border-l border-[var(--annotation-color)] px-3 font-normal italic transition {!more &&
									expandable
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
										class="z-10 col-start-12 row-start-1 row-end-1 cursor-default place-self-end pl-4 font-semibold text-primary-600 backdrop-opacity-50"
										on:click={() => (more = !more)}
										>{more ? "Less" : "More"}</button
									>
								{/if}
							</div>
						{:else if annotation.target && annotation.type === "annotation"}
							{#if annotation.target.selector?.type === "FragmentSelector"}
								<!-- time = t=x,y -->
								{@const time = annotation.target.selector.value}
								{@const [start, end] = time.split("=")[1].split(",")}
								<button
									on:click={() => {
										dispatch("seek", start);
									}}
									class=""
								>
									{dayjs.duration(start, "seconds").format("mm:ss")}
								</button>
							{/if}
						{/if}
						{#if annotation.body}
							<div class="prose prose-sm font-normal">{annotation.body}</div>
						{:else if annotation.contentData}
							<div class="prose prose-sm font-normal">
								{@html genHtml(annotation.contentData)}
							</div>
						{/if}
						{#if "tags" in annotation && annotation.tags?.length}
							<TagCloud tags={annotation.tags} />
						{/if}
					</div>
				{:else}
					<div>Annotation deleted</div>
				{/if}
				{#if annotation.children?.length || ("_count" in annotation && annotation._count.children)}
					{@const count =
						annotation.children?.length ||
						("_count" in annotation && annotation._count.children)}
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
						<DisclosurePanel
							class="flex w-full flex-col gap-2 border-l border-gray-500/50 pl-2"
						>
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
			</div>
			{#if replying}
				<div class=" w-full border-l border-gray-500/50 pl-2">
					<form
						action="/annotations?/reply"
						method="post"
						use:enhance={() => {
							console.log("saving reply");
							saving = true;
							return ({ update, result }) => {
								console.log({ result });
								update({ reset: false }).then(() => (replying = false));
								saving = false;
							};
						}}
					>
						<input type="hidden" name="id" value={annotation.id} />
						<AnnotationInput
							name="body"
							include_tags={false}
							rows={1}
							confirmButtonStyle="ghost"
							class="text-sm"
							{saving}
						/>
					</form>
				</div>
			{/if}
		</div>
	{/if}
</div>
