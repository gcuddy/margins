<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import Annotation from "$lib/components/Annotation.svelte";
	import AnnotationInput from "$lib/components/annotations/AnnotationInput.svelte";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import StateCombobox from "$lib/components/StateCombobox.svelte";
	import TagInputCombobox from "$lib/components/TagInputCombobox.svelte";
	import dayjs from "$lib/dayjs";
	import { checkIfKeyboardShortcutsAllowed } from "$lib/stores/keyboard";
	import { createRelativeDateStore } from "$lib/stores/relativeDate";
	import { syncStore } from "$lib/stores/sync";
	import { trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { TextQuoteTarget } from "$lib/types/schemas/Annotations";
	import type { Tag } from "@prisma/client";
	import { Disclosure, DisclosureButton, DisclosurePanel } from "@rgossiaux/svelte-headlessui";
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import { tweened } from "svelte/motion";
	import { writable } from "svelte/store";
	import { fade, fly, slide } from "svelte/transition";
	import ReadingSidebarAnnotationInput from "./ReadingSidebarAnnotationInput.svelte";
	import ReadingSidebarSection from "./ReadingSidebarSection.svelte";
	import { reading_sidebar } from "./stores";
	export let entry: RouterOutputs["entries"]["load"];

	function customBackOut(t: number) {
		const s = 0.7;
		return --t * t * ((s + 1) * t + s) + 1;
	}
	$: pageNotes = entry?.annotations?.filter((a) => a.type === "note");
	$: inlineNotes = entry?.annotations?.filter((a) => a.type === "annotation");

	let tags: Tag[] = [];
	$: console.log({ tags });

	let WIDTH = 428;

	let WIDTH_SPRING = tweened(WIDTH, {
		duration: 400,
		easing: customBackOut,
		delay: 0,
	});

	let display = $reading_sidebar.active;

	$: if ($reading_sidebar.active) {
		display = $reading_sidebar.active;
		WIDTH_SPRING.set(0);
	} else {
		WIDTH_SPRING.set(WIDTH).then(() => (display = $reading_sidebar.active));
	}

	let noting = false;
	let noting_id: number | null = null;

	const busy = writable({
		note: false,
	});

	$: savedDate = createRelativeDateStore(entry.bookmark?.createdAt);

	onMount(() => {
		// set tweened store with no animation
		if ($reading_sidebar.active) {
			display = $reading_sidebar.active;
			WIDTH_SPRING.set(0, {
				duration: 0,
			});
		}
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === "Escape") {
			if (checkIfKeyboardShortcutsAllowed()) {
				$reading_sidebar.active = false;
			}
		}
	}}
/>

<!-- mt-8 to account for reading menu -->

{#if display}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={() => ($reading_sidebar.active = false)}
		class="inset-0 hidden bg-black/10 max-md:fixed max-md:block"
	/>
	<aside
		style:margin-left="{$WIDTH_SPRING * -1}px"
		style:width="{WIDTH}px"
		style:transform="translateX({$WIDTH_SPRING}px)"
		class="z-10 mt-14 flex max-h-full flex-col space-y-5 overflow-auto overflow-y-auto border-gray-200 bg-gray-50 p-4 shadow-lg backdrop-blur-md transition-shadow dark:border-gray-700 dark:bg-transparent dark:bg-gradient-to-br dark:from-gray-800/90  dark:to-gray-900/90 dark:shadow-stone-900 max-md:absolute max-md:top-0 max-md:right-0 max-md:bottom-0 max-md:border-l sm:w-96 md:relative"
	>
		<!-- <div class="absolute top-0 left-0 h-full w-full bg-red-500" style:width="450px" /> -->

		<div class="flex flex-col gap-y-2 divide-y dark:divide-gray-700/40">
			<div class="flex flex-col gap-y-1">
				<span class="text-lg font-semibold">{entry.title}</span>
				<span class="text-base font-medium">{entry.author}</span>
			</div>
			<ReadingSidebarSection>
				<svelte:fragment slot="heading">Metadata</svelte:fragment>

				<div class="flex flex-col gap-y-1">
					{#if entry.feedId}
						<!-- display feed -->
						<!-- Or just put this in context section -->
						subscription: {$page.data.subscriptions?.find((s) => s.feedId === entry.feedId)?.title}
					{/if}
					<div class="grid auto-rows-fr grid-cols-[minmax(90px,_auto)_1fr] items-center text-sm">
						<!-- REVIEW: what metadata to show -->
						{#if entry.bookmark}
							<Muted>Saved</Muted>
							<div class="px-2">{$savedDate}</div>
						{/if}
						{#if entry.bookmark?.stateId}
							<Muted class="text-sm">Status</Muted>
							<StateCombobox
								state={$page.data.states?.find((state) => state.id === entry.bookmark.stateId)}
								onSelect={async (state) => {
									const s = syncStore.add();
									await trpc().bookmarks.updateState.mutate({
										id: $page.data.article.bookmark?.id,
										stateId: state.id,
										entryId: $page.data.article.id,
									});
									await invalidateAll();
									syncStore.remove(s);
								}}
							/>
						{/if}
						<Muted class="text-sm">Tags</Muted>
						<TagInputCombobox bind:tags={entry.tags} original={{ ...entry }} />
						{#if entry.context}
							<Muted class="text-sm">Context</Muted>
							{JSON.stringify(entry.context)}
						{/if}
					</div>
				</div>
			</ReadingSidebarSection>
			<Disclosure defaultOpen={true} let:open class="flex flex-col gap-3 p-2 text-sm">
				<div class="flex items-center justify-between">
					<DisclosureButton class="group -ml-2 flex items-center gap-2 rounded py-1 px-2 hover:bg-gray-200">
						<SmallPlus><Muted>Page Notes</Muted></SmallPlus>
						<Icon
							name={open ? "chevronUpMini" : "chevronDownMini"}
							className="h-4 w-4 fill-gray-400 opacity-0 group-hover:opacity-100"
						/>
					</DisclosureButton>
					<button
						in:fade|local={{ delay: 400 }}
						disabled={noting}
						class="flex items-center self-end rounded-lg p-1.5 text-xs font-medium dark:hover:bg-gray-700/50 "
						on:click={() => (noting = true)}
					>
						<Icon name="plusMini" className="h-4 w-4 fill-gray-400" />
						<Muted>Add note</Muted></button
					>
				</div>
				{#if open}
					<div
						transition:slide|local={{
							duration: 75,
						}}
					>
						<DisclosurePanel class="flex flex-col gap-3" static>
							<!-- TODO: use-dndzone -->
							{#each pageNotes || [] as annotation (annotation.id)}
								<div>
									{#if annotation.id !== noting_id}
										<Annotation
											{annotation}
											onEdit={() => {
												noting_id = annotation.id;
											}}
										/>
									{:else}
										<form
											action="?/updateNote"
											method="post"
											use:enhance={({}) => {
												$busy.note = true;
												return async ({ result, update }) => {
													await update({
														reset: false,
													});
													$busy.note = false;
													noting_id = null;
												};
											}}
											on:keydown={(e) => {
												if (e.key === "escape") {
													// todo: noting = false
												}
											}}
										>
											<input type="hidden" name="id" value={annotation.id} />
											<AnnotationInput
												placeholder="Add a page note…"
												rows={1}
												shadow_focus={true}
												include_tags={false}
												confirmButtonStyle="ghost"
												class="text-sm"
												value={annotation.body?.toString() || ""}
											>
												<svelte:fragment slot="buttons">
													<Button
														type="reset"
														on:click={() => (noting_id = null)}
														variant="ghost"
														size="sm"
														className="text-sm">Cancel</Button
													>
													<Button disabled={$busy.note} variant="ghost" size="sm" className="text-sm"
														>{#if $busy.note}
															<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
														{:else}
															Save
														{/if}
													</Button>
												</svelte:fragment>
											</AnnotationInput>
										</form>
									{/if}
								</div>
							{/each}
							{#if noting}
								<!-- REVIEW: is this action ok, since reading sidebar will always be in the entry? -->
								<!-- TODO: optimistic update  -->
								<form
									action="?/note"
									method="post"
									use:enhance={({}) => {
										$busy.note = true;
										return async ({ result, update }) => {
											console.log({ result });
											await update({
												reset: false,
											});
											$busy.note = false;
											noting = false;
										};
									}}
									transition:fly={{ y: -10 }}
									on:keydown={(e) => {
										if (e.key === "escape") {
											// todo: noting = false
										}
									}}
								>
									<AnnotationInput
										placeholder="Add a page note…"
										rows={1}
										shadow_focus={true}
										include_tags={false}
										confirmButtonStyle="ghost"
										class="text-sm"
									>
										<svelte:fragment slot="buttons">
											<Button
												type="reset"
												on:click={() => (noting = false)}
												variant="ghost"
												size="sm"
												className="text-sm">Cancel</Button
											>
											<Button
												type="submit"
												disabled={$busy.note}
												variant="ghost"
												size="sm"
												className="text-sm"
												>{#if $busy.note}
													<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
												{:else}
													Save
												{/if}
											</Button>
										</svelte:fragment>
									</AnnotationInput>
								</form>
							{/if}
						</DisclosurePanel>
					</div>
				{/if}
			</Disclosure>
			{#if inlineNotes?.length}
				<Disclosure defaultOpen={true} let:open class="flex flex-col gap-3 p-2 text-sm">
					<div>
						<DisclosureButton class="group -ml-2 flex items-center gap-2 rounded py-1 px-2 hover:bg-gray-200">
							<SmallPlus><Muted>Annotations ({inlineNotes.length})</Muted></SmallPlus>
							<Icon
								name={open ? "chevronUpMini" : "chevronDownMini"}
								className="h-4 w-4 fill-gray-400 opacity-0 group-hover:opacity-100"
							/>
						</DisclosureButton>
					</div>
					{#if open}
						<div transition:slide|local={{ duration: 75 }}>
							<DisclosurePanel static>
								<div class="flex flex-col space-y-4  text-sm">
									{#each inlineNotes as annotation}
										{@const target = TextQuoteTarget.parse(annotation.target)}
										<!-- should maybe be an a or button -->
										<Annotation {annotation} scrollOnClick={true} />
									{/each}
								</div>
							</DisclosurePanel>
						</div>
					{/if}
				</Disclosure>
			{/if}
		</div>
	</aside>
{/if}
