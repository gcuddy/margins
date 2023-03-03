<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { trpc } from "$lib/trpc/client";
	import { createQuery } from "@tanstack/svelte-query";
	import debounce from "lodash.debounce";
	import { podcastSearchQuery } from "$lib/features/podcasts/queries";
	import type { ActionData, PageData } from "./$types";
	import SearchItem from "$lib/features/podcasts/SearchItem.svelte";

	export let data: PageData;
	let value = "";

	async function search() {
		if (!value) {
			// return promise results []
			return [];
		}
		const { feeds } = await trpc($page).podcasts.public.search.query(value.trim());
		return feeds;
	}

	// credit https://github.com/lodash/lodash/issues/4700
	function asyncDebounce<F extends (...args: any[]) => Promise<any>>(func: F, wait?: number) {
		const throttled = debounce((resolve, reject, args: Parameters<F>) => {
			func(...args)
				.then(resolve)
				.catch(reject);
		}, wait);
		return (...args: Parameters<F>): ReturnType<F> =>
			new Promise((resolve, reject) => {
				throttled(resolve, reject, args);
			}) as ReturnType<F>;
	}

	const debouncedSearch = asyncDebounce(search, 300);

	// $: value, queryFn()?.then((x) => console.log(x));
	$: query = createQuery({
		...podcastSearchQuery($page, data.q as string),
		enabled: !!data.q,
		// queryKey: ["search", value],
		// // REVIEW: do i need to debounce this to avoid getting rate limtied?
		// queryFn: debouncedSearch,
		// // enabled: !!value,
		// onSuccess: (d) => {
		// 	console.log(d);
		// },
		refetchOnWindowFocus: false,
		// keepPreviousData: true,
		initialData: data.results,
		// initialData: form?.results ? form.results : undefined,
	});

	// $: if (value) {
	// 	const s = debouncedSearch().then((x) => console.log(x));
	// 	console.log({ s });
	// 	// debouncedSearch()?.then((r) => console.log(r));
	// }

	// async function handleSubmit() {
	// 	const results = await fn(value);
	// 	console.log({ results });
	// }

	let error_ids: number[] = [];

	let form: HTMLFormElement;

	const debouncedSubmit = debounce(() => {
		// not supported in all browsers
		if (typeof HTMLFormElement.prototype.requestSubmit == "function") {
			form.requestSubmit();
		}
	}, 300);

	export function submitReplaceState(e: Event) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const url = new URL(form.action);
		// @ts-expect-error
		const params = new URLSearchParams(new FormData(form));
		url.search = params.toString();
		goto(url, { replaceState: true, keepFocus: true, noScroll: true });
	}
</script>

<div class="flex flex-col gap-4">
	<!-- TODO: i should actually make this a get, no?  and cache it? -->
	<!-- REVIEW: progressively enhance this by making it in load function and ?q -->
	<form bind:this={form} class="flex" on:submit|preventDefault={submitReplaceState}>
		<label for="q">Query</label>
		<GenericInput id="q" name="q" on:input={debouncedSubmit} />

		<button>search</button>
	</form>

	<div>
		{#if $query.isLoading}
			{$query.data}
			{JSON.stringify($query)}
			<p>Loading...</p>
		{:else if $query.isError}
			<p>Error</p>
		{:else if $query.isSuccess && $query.data}
			<!-- {JSON.stringify($query.data)} -->
			<ul class="divide-y dark:divide-gray-700/25">
				{#each $query.data.feeds as feed}
					{@const subscribed = data.user?.subscriptions?.some((s) => s.feed?.podcastIndexId === feed.id)}
					<SearchItem {feed} />
				{/each}
			</ul>
		{/if}
	</div>
</div>
