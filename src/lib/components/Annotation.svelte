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
	import { Disclosure, DisclosureButton, DisclosurePanel } from "@rgossiaux/svelte-headlessui";
	import { dataset_dev } from "svelte/internal";

	export let annotation: RouterOutputs["entries"]["load"]["annotations"][number] & {
		children?: RouterOutputs["entries"]["load"]["annotations"][number];
	};
	export let scrollOnClick = false;

	const dispatch = createEventDispatcher();

	let editing = false;
	let replying = false;

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
{#if !editing}
	<AnnotationWrapper class={busy ? "opacity-50" : ""}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
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
					<DotMenu
						class="p-1"
						offset={[0, 0]}
						strategy="fixed"
						items={[
							[
								{
									label: "Edit",
									icon: "pencilMini",
									check: () => annotation.creator.username === $page.data.user?.username,
									perform: async () => {
										editing = true;
										dispatch("edit");
									},
								},
								{
									label: "Reply",
									icon: "replySolid",
									perform: async () => {
										dispatch("reply");
										replying = true;
									},
								},
								{
									label: `Make ${annotation.private ? "Public" : "Private"}`,
									icon: annotation.private ? "lockOpenMini" : "lockClosedMini",
									perform: async () => {
										// combobox = true;
										busy = true;
										await trpc().annotations.update.mutate({
											id: annotation.id,
											data: {
												private: !annotation.private,
											},
										});
										await invalidateAnnotations();
										busy = false;
									},
								},
								{
									label: "Delete",
									icon: "trashMini",
									perform: async () => {
										busy = true;
										await trpc().annotations.delete.mutate(annotation.id);
										await invalidateAnnotations();
										busy = false;
									},
								},
							],
						]}
					/>
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
							class="col-start-12 row-start-1 row-end-1 cursor-default place-self-end pl-4 font-semibold  text-primary-600 backdrop-blur-lg"
							on:click={() => (more = !more)}>{more ? "Less" : "More"}</button
						>
					{/if}
				</div>
			{/if}
			<div class="font-normal">{annotation.body}</div>
		</div>
		{#if annotation["_count"].children}
			{@const count = annotation["_count"].children}
			<!-- TODO: on click load replies -->
			<!-- TODO: progressively enhance by having this be a link to dedicated entry/annotations page -->
			<Disclosure class="w-full">
				<DisclosureButton
					on:click={async () => {
						if (!annotation.children) {
							annotation.children = await trpc().annotations.loadReplies.query({
								id: annotation.id,
							});
						}
					}}
				>
					{count} repl{count > 1 ? "ies" : "y"}
				</DisclosureButton>
				<DisclosurePanel class="flex w-full flex-col gap-2">
					{#if annotation.children}
						{#await children_promise}
							<!-- promise is pending -->
							loading...
						{:then children}
							<!-- promise was fulfilled -->
							{#each children as child}
								<svelte:self annotation={child} />
							{/each}
						{/await}
					{/if}
				</DisclosurePanel>
			</Disclosure>
		{/if}
		{#if replying}
			<div class="ml-3 border-l border-gray-500/25 pl-1">
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
	</AnnotationWrapper>
{/if}
