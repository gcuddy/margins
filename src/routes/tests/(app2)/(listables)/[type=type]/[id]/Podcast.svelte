<script lang="ts">
	import smoothload from "$lib/actions/smoothload";
	import Button, { buttonVariants } from "$lib/components/ui/Button.svelte";
	import { Dialog, DialogContent } from "$lib/components/ui/dialog";
	import DialogTrigger from "$lib/components/ui/dialog/DialogTrigger.svelte";
	import { H1, Lead, Subtle } from "$lib/components/ui/typography";
	import { isUpcoming } from "$lib/utils/date";

	import type { PageData } from "./$types";
	import BookmarkForm from "./BookmarkForm.svelte";
	type Podcast = PageData["podcast"];
	export let data: PageData & {
		podcast: NonNullable<Podcast>;
	};

	$: ({
		podcast: { episode },
	} = data);
</script>

<div class="flex select-text flex-col gap-4">
	<div class="flex gap-6 max-sm:flex-col sm:items-center">
		<img
			src={data.podcast.episode.image || data.podcast.episode.feedImage}
			alt=""
			class="aspect-auto rounded-md shadow-lg sm:w-[150px] md:w-[200px]"
			use:smoothload
		/>
		<div class="flex flex-col gap-2">
			<Subtle>Podcast</Subtle>
			<H1>{episode.title}</H1>
			<Lead>
				<a href="/tests/show/p{episode.feedId}">{episode.feedTitle}</a>
				<!-- {#if director}
					<a href="/tests/people/t{director.id}">{director.name}</a>{/if} — {new Date(
					data.movie.release_date
				).getFullYear()} -->
			</Lead>
			<div class="flex space-x-4">
				<Button>Play</Button>
				<BookmarkForm data={data.bookmarkForm} />
			</div>
		</div>
	</div>
	<!-- 
	<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2 text-sm">
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Subtle>Release Date</Subtle></dt>
			<dd>
				<Subtle>
					{data.movie.release_date}
				</Subtle>
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Subtle>Runtime</Subtle></dt>
			<dd>
				<Subtle>
					{data.movie.runtime} minutes
				</Subtle>
			</dd>
		</div>
	</dl> -->

	<div class="prose prose-slate space-y-4 dark:prose-invert">
		<div>
			{@html data.podcast.episode.description}
		</div>
	</div>
</div>
