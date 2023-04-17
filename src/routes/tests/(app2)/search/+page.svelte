<script lang="ts">
	import { page } from "$app/stores";
	import ItemArtwork from "$lib/components/ItemArtwork.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Label from "$lib/components/ui/Label.svelte";
	import { H1 } from "$lib/components/ui/typography";
	import { cn } from "$lib/utils/tailwind";
	export let data;
	const prefix = $page.url.pathname;
	const tabs = [
		{
			name: "My stuff",
			href: "my",
		},
		{
			name: "Movies + TV",
			href: "movies",
		},
		{
			name: "Books",
			href: "books",
		},
		{
			name: "Podcasts",
			href: "podcasts",
		},
	];
	let q = data.q ?? "";
	// $: q = $page.url.searchParams.get("q") ?? "";
	$: tab = $page.url.searchParams.get("type");

	const setType = (type: string) => {
		const Url = $page.url;
		Url.searchParams.set("type", type);
		if (q) Url.searchParams.set("q", q);
		return Url.toString();
	};
</script>

<H1>Search</H1>

<form data-sveltekit-keepfocus class="my-4">
	<input type="hidden" name="type" value={tab} />
	<Label for="search" class="sr-only">Search</Label>
	<Input bind:value={q} id="search" name="q" placeholder="search" />
</form>
<div
	class="inline-flex items-center justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800"
>
	<!--  -->
	{#each tabs as { name, href }}
		{@const selected = tab === href}
		<a
			href="?type={href}{q ? '&q=' + q : ''}"
			class={cn(
				"inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium text-gray-700 transition-all  disabled:pointer-events-none disabled:opacity-50 dark:text-gray-200 ",
				selected &&
					"bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100"
			)}
		>
			{name}
		</a>
	{/each}
</div>

<div class="mx-auto mt-4 flex flex-wrap justify-center gap-4 px-2 pb-4">
	{#each data.results || [] as result}
		<ItemArtwork item={result} class="w-32" />
	{/each}
</div>
