<script lang="ts">
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import RssItem from '$lib/components/rss/RSSItem.svelte';
	import type { RssItemWithFeed } from '$lib/types/rss';
	export let item: RssItemWithFeed;
</script>

<div class="flex flex-col overflow-hidden">
	<!-- <Header>
		<a sveltekit:prefetch class="flex items-center space-x-2" href="/rss/{item.RssFeed.id}"
			><Icon name="chevronLeftSolid" />{item?.RssFeed.title}</a
		>
	</Header> -->
	<RssItem {item} scrollIntoView={false} linkBack={true} />
	<!-- <article
			class="m-3 rounded-2xl bg-gray-50 shadow-xl ring-1 ring-black/5 dark:bg-gray-800 dark:shadow-2xl  dark:ring-white/5"
		>
			<div class="overflow-auto">
				<ProseWrapper breakpoints={false}>
					<header class="mx-auto max-w-prose">
						<a href={item.link}
							><h1 class="text-3xl tracking-tight">
								{item.title}
							</h1>
						</a>
						<p class="meta">
							{#if item.pubDate}
								<time datetime={dayjs(item.pubDate).toISOString()}
									>{dayjs(item.pubDate).format('MMM D, YYYY')}</time
								>
							{/if}
							{#if item.author}
								<span> by {item.author}</span>
							{/if}
						</p>
					</header>
					{@html item.content || item.contentSnippet || item.summary || '[No content]'}
				</ProseWrapper>
			</div>
		</article> -->
</div>
