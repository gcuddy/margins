<script>
	// TODO: Progressively enhance this
	import debounce from 'lodash.debounce';
	let url = 'https://itunes.apple.com/search?media=podcast';
	export let value;
	let promise;
	async function search() {
		url = url.toString() + `&term=${encodeURIComponent(value)}`;
		// 		promise = fetch(url);
		const res = await fetch(url);
		promise = res.text().then((t) => JSON.parse(t));
	}
	const debouncedSearch = debounce(search, 500);
	$: if (value) {
		debouncedSearch();
	} else {
		promise = null;
	}

	import GenericInput from '$lib/components/GenericInput.svelte';
	import Combobox from '$lib/components/helpers/Combobox.svelte';

	async function parseUrl(url) {
		console.log({ url });
		const text = await fetch(url).then((res) => res.text());
		console.log({ text });
		const xml = xmlParser.parse(text);
		console.log({ xml });
		if (xml.rss?.['@_xmlns:itunes'] !== 'http://www.itunes.com/dtds/podcast-1.0.dtd') {
			throw Error('bad feed');
		}
		return {
			title: xml.rss.channel.title,
			description: xml.rss.channel.description,
			image: xml.rss.channel.image?.url,
			// 		todo: parse items
			items: xml.rss.channel.items,
		};
	}
</script>

<GenericInput bind:value />

{#if promise}
	{#await promise}
		<p>...waiting</p>
	{:then res}
		<ul>
			{#each res.results.filter((r) => r.kind === 'podcast') as result}
				<li>
					<!-- 	href="{result.feedUrl}"		 -->
					<a href="/rss/podcasts/{result.collectionId}" data-sveltekit-prefetch>
						<img src={result.artworkUrl100} alt="Artwork for {result.collectionName}" />
						<div>
							{result.collectionName}
						</div>
						<div>
							{result.artistName}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
{/if}
