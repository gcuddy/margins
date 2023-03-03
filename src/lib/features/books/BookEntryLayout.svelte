<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import ImageLoader from "$lib/components/ui/images/ImageLoader.svelte";
	import dayjs from "$lib/dayjs";
	import type { Maybe } from "@trpc/server";

	let busy = false;

	export let image: Maybe<string> = "";
	export let fallbackImage: Maybe<string> = "";
	export let title: Maybe<string> = "";
	export let subtitle: Maybe<string> = "";
	export let author: Maybe<string> = "";
	export let description: Maybe<string> = "";
	export let bookId: string;
	export let pageCount: number | undefined | null = undefined;
	export let published: Date | string | undefined | null = undefined;
	export let bookmarked = false;
	export let isbn: string | undefined | null = undefined;

	export let genres: Maybe<string> = "";
	export let publisher: Maybe<string> = "";
	export let language: Maybe<string> = "";
</script>

<div class="relative flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
	<div class="flex shrink-0 flex-col gap-4 p-2 sm:p-0">
		<ImageLoader
			class="w-auto  rounded  border border-border drop-shadow-2xl dark:border-border/25 sm:max-h-60"
			src={image}
			alt=""
			on:error={(e) => (image = fallbackImage)}
		/>
		<slot name="underImage" />
	</div>
	<div class="space-y-4 sm:space-y-8">
		<div class="flex flex-col text-center sm:text-left">
			<h1 class="text-2xl font-bold">{title}</h1>
			{#if subtitle}
				<Muted class="text-lg font-medium">{subtitle}</Muted>
			{/if}
			<a class="text-lg"><Muted>{author}</Muted></a>

			{#if bookmarked}
				<!-- TODO -->
			{:else}
				<form
					action="/books/{bookId}?/save"
					method="post"
					use:enhance={() => {
						busy = true;
						return async ({ update }) => {
							await update();
							busy = false;
						};
					}}
				>
					<input type="hidden" name="bookId" value={bookId} />
					<input type="hidden" name="title" value={title} />
					<input type="hidden" name="description" value={description} />
					<input type="hidden" name="published" value={published} />
					<input type="hidden" name="author" value={author} />
					<input type="hidden" name="pageCount" value={pageCount} />
					<input type="hidden" name="image" value={image} />
					<!-- {#if book.imageLinks}
                        <input type="hidden" name="image" value={selectImage(book.imageLinks)} />
                    {/if} -->
					<input type="hidden" name="isbn" value={isbn} />
					{#if !bookmarked}
						<Button type="submit" disabled={busy} className="self-start flex items-center">
							{#if busy}
								<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
							{:else}
								<span>Save</span>
							{/if}
						</Button>
					{/if}
				</form>
			{/if}
			<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2">
				<div class="flex flex-col">
					<dt class="text-xs uppercase"><Muted>Year</Muted></dt>
					<dd><Muted>{dayjs(published).year()}</Muted></dd>
				</div>
				<div class="flex flex-col">
					<dt class="text-xs uppercase"><Muted>Genre</Muted></dt>
					<dd><Muted>{genres}</Muted></dd>
				</div>
				<div class="flex flex-col">
					<dt class="text-xs uppercase"><Muted>Pages</Muted></dt>
					<dd><Muted>{pageCount || "-"}</Muted></dd>
				</div>
				<div class="flex flex-col">
					<dt class="text-xs uppercase"><Muted>Publisher</Muted></dt>
					<dd><Muted>{publisher}</Muted></dd>
				</div>
				<div class="flex flex-col">
					<dt class="text-xs uppercase"><Muted>Language</Muted></dt>
					<dd><Muted>{language}</Muted></dd>
				</div>
				<div class="flex flex-col ">
					<dt class="text-xs uppercase"><Muted>ISBN</Muted></dt>
					<dd>
						<Muted>{isbn || "-"}</Muted>
					</dd>
				</div>
			</dl>
			<!-- TODO: categories here -->
		</div>
		<div class="relative overflow-hidden text-sm ">
			<div class="prose prose-stone text-sm  leading-normal  dark:prose-invert">
				{@html description}
			</div>
		</div>
	</div>
</div>
