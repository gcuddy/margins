<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import { modals } from "$lib/stores/modals";
	import { notifications } from "$lib/stores/notifications";
	import type { ActionData } from "../../routes/(app)/u:[username]/(view)/subscriptions/new/$types";
	import Checkbox from "$lib/components/ui/Checkbox.svelte";
	import { Button } from '$lib/components/ui/button';
	import Muted from "./atoms/Muted.svelte";
	import SmallPlus from "./atoms/SmallPlus.svelte";
	import GenericInput from "./GenericInput.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Icon from "./helpers/Icon.svelte";
	import Label from "$lib/components/ui/Label.svelte";
	import { Muted } from "$lib/components/ui/typography";
	import Switch from "$lib/components/ui/Switch.svelte";
	import toast from "svelte-french-toast";
	import { goto } from "$app/navigation";
	import { Loader2 } from "lucide-svelte";

	export let form: ActionData | undefined = undefined;
	export let close = () => {};

	const client = trpc($page);
	const ctx = client.createContext();
	$: console.log({ close });
	$: console.log({ form });
	let searching = false;
	let adding = false;

	// kind of ugly way to do this...
	$: form &&
		"feeds" in form &&
		!form.feeds.length &&
		notifications.notify({
			type: "error",
			title: "No feed found!",
		});
</script>

<div class="flex flex-col gap-y-4">
	<form
		action="/u:{$page.data.user?.username}/subscriptions/new?/search"
		method="post"
		class="flex flex-col text-lg"
		use:enhance={() => {
			searching = true;
			return async ({ result, update }) => {
				searching = false;
				console.log({ result });
				if (result.type === "success") {
					// @ts-ignore
					form = result.data;
					console.log({ $page });
					// TODO: pick up here tomorrow
				}
			};
		}}
	>
		<div>
			<Label class="px-3" for="url"><Muted>Add subscription</Muted></Label>
			<!-- < for="url"
				><SmallPlus><Muted>Add Subscription</Muted></SmallPlus></label
			> -->
		</div>
		<div class="grid grid-rows-1">
			<!-- class="col-start-1 row-start-1 px-0 text-lg" -->
			<Input
				class="col-start-1 row-start-1 text-lg"
				variant="naked"
				id="url"
				placeholder="Feed or Website"
				name="url"
			/>
			<div
				class="col-start-1 row-start-1 flex items-center justify-self-end pr-3 opacity-0 transition-opacity {searching ||
				(form && 'favicon' in form)
					? 'opacity-100'
					: ''}"
			>
				{#if searching}
					<Icon
						name="loading"
						className="h-5 w-5 text-gray-500 {searching ? 'animate-spin' : ''}"
					/>
				{:else if form && "favicon" in form}
					<img
						src={form.favicon}
						alt=""
						class="h-4 max-w-[24px] rounded object-contain"
					/>
				{/if}
			</div>
			<!-- TODO: display grid and place -end -->
		</div>
		{#if form && "message" in form}
			<span class="text-red-500">{form.message}</span>
		{/if}
	</form>

	{#if form && "feeds" in form && form?.feeds && form.feeds.length}
		<form
			action="/u:{$page.data.user?.username}/subscriptions/new?/add"
			method="post"
			use:enhance={(e) => {
				console.log("SUBMITTING");
				adding = true;
				return async ({ update, result }) => {
					console.log({ result });
					// update();
					adding = false;
					if (close) {
						close();
					} else {
						modals.close({
							id: "feed-entry",
						});
					}
					if (result.type === "success") {
						toast.success("Subscription added!");
						if (!result.data) return;
						const { added } = result.data;
						const id = added?.[0]?.feed_id;
						await ctx.subscriptions.list.invalidate();
						if (id) {
							await goto(`/u:${$page.data.user?.username}/subscriptions/${id}`);
						}
					}
				};
			}}
			class="flex flex-col gap-y-4 px-3"
		>
			<fieldset class="space-y-4">
				<legend><Muted>Feeds</Muted></legend>
				{#each form.feeds as feed, index}
					{@const id = `feed-${index}`}
					<div class="space-y-0.5">
						<div class="flex grid-cols-12 gap-x-2 gap-y-1">
							{#if form.feeds.length > 1}
								<div class="flex shrink-0 items-center justify-center">
									<Checkbox
										name="feeds[{index}][url]"
										value={feed.url}
										id="feed-checkbox-{index}"
										checked={index === 0}
									/>
								</div>
							{:else}
								<input
									type="hidden"
									name="feeds[{index}][url]"
									value={feed.url}
								/>
							{/if}
							<div
								class="{form.feeds.length > 1
									? 'col-start-2'
									: 'col-start-1'} col-end-13 grow"
							>
								<Input
									{id}
									autofocus={index === 0 ? true : undefined}
									value={feed.title}
									name="feeds[{index}][title]"
									class=""
								/>
							</div>
						</div>
						<div class="col-span-full flex justify-end pr-2">
							<Label class="row-start-2" for="feed-checkbox-{index}">
								<Muted class="text-xs">{feed.url}</Muted>
							</Label>
						</div>
					</div>
				{/each}
			</fieldset>
			<div
				class="flex justify-end border-t border-gray-500 pt-4 dark:border-gray-700"
			>
				<Button type="submit" disabled={adding}
					>Save
					{#if adding}
						<Loader2 class="h-4 w-4 animate-spin" />
					{/if}
				</Button>
			</div>
		</form>
	{/if}
	{#if form && "success" in form}
		<span class="text-lime-500">Successfully added</span>
	{/if}
</div>
