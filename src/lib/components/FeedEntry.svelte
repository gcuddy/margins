<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { modals } from '$lib/stores/modals';
	import type { ActionData } from '.svelte-kit/types/src/routes/(app)/u:[username]/subscriptions/new/$types';
	import { update } from 'idb-keyval';
	import Button from './Button.svelte';
	import GenericInput from './GenericInput.svelte';
	import Icon from './helpers/Icon.svelte';
	export let form: ActionData | undefined = undefined;
	$: console.log({ form });
	let searching = false;
	let adding = false;
</script>

<form
	action="/u:{$page.data.user?.username}/subscriptions/new?/search"
	method="post"
	class="space-y-2 text-lg"
	use:enhance={() => {
		searching = true;
		return async ({ result, update }) => {
			searching = false;
			if (result.type === 'success') {
				// @ts-ignore
				form = result.data;
				console.log({ $page });
				// TODO: pick up here tomorrow
			}
		};
	}}
>
	<div class="grid grid-rows-1">
		<GenericInput placeholder="Feed or Website" name="url" class="col-start-1 row-start-1" />
		<div
			class="col-start-1 row-start-1 flex items-center justify-self-end pr-3 opacity-0 transition-opacity {searching ||
			(form && 'favicon' in form)
				? 'opacity-100'
				: ''}"
		>
			{#if searching}
				<Icon name="loading" className="h-5 w-5 text-gray-500 {searching ? 'animate-spin' : ''}" />
			{:else if form && 'favicon' in form}
				<img src={form.favicon} alt="" class="h-4 max-w-[24px] rounded object-contain" />
			{/if}
		</div>
		<!-- TODO: display grid and place -end -->
	</div>
	{#if form && 'message' in form}
		<span class="text-red-500">{form.message}</span>
	{/if}
</form>

{#if form && 'feeds' in form && form?.feeds && form.feeds.length}
	<form
		action="/u:{$page.data.user?.username}/subscriptions/new?/add"
		method="post"
		use:enhance={(e) => {
			console.log('SUBMITTING');
			return ({ update }) => {
				update();
				adding = false;
				modals.close({
					id: 'feed-entry',
				});
			};
		}}
	>
		{#each form.feeds as feed, index}
			<label>
				{feed.url}
				<input type="checkbox" name="feeds[{index}][url]" value={feed.url} checked={index === 0} />
				<GenericInput
					autofocus={index === 0 ? true : undefined}
					value={feed.title}
					name="feeds[{index}][title]"
				/>
			</label>
		{/each}
		<div class="flex justify-end p-2">
			<Button type="submit" disabled={adding}>Save</Button>
		</div>
	</form>
{/if}
{#if form && 'success' in form}
	<span class="text-lime-500">Successfully added</span>
{/if}
