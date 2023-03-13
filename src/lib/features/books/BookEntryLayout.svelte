<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import ImageLoader from "$lib/components/ui/images/ImageLoader.svelte";
	import dayjs from "$lib/dayjs";
	import { notifications } from "$lib/stores/notifications";
	import type { Maybe } from "@trpc/server";
	import { fade } from "svelte/transition";

	let busy = false;
    let saved = false;

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

<div class="relative mx-auto flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
	<div class="flex shrink-0 flex-col gap-4 p-2 sm:p-0">
		<ImageLoader
			wrapper="max-w-max place-self-center sm:place-self-auto"
			class="mx-auto  h-60 w-40  rounded shadow-2xl  dark:border-border/25 dark:shadow-2xl dark:shadow-[var(--book-shadow-color)] sm:max-h-60"
			src={image}
			alt=""
			on:error={(e) => (image = fallbackImage)}
		>
			<!-- book cover gradient -->
			<div class="book-cover absolute inset-0" />
		</ImageLoader>
		<slot name="underImage" />
	</div>
	<div class="space-y-4">
		<div class="flex h-60 flex-col text-center sm:text-left">
			<h1 class="text-2xl font-bold">{title}</h1>
			{#if subtitle}
				<Muted class="text-lg font-medium">{subtitle}</Muted>
			{/if}
			<a class="text-lg"><Muted>{author}</Muted></a>

			<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2 text-sm">
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
			{#if bookmarked}
				<!-- TODO -->
			{:else}
				<form
                    out:fade|local
					action="/books/{bookId}?/save"
					method="post"
					class="mt-auto"
					use:enhance={() => {
						busy = true;
						return async ({ update, result }) => {
							if (result.type === "success") {
                                console.log({result})
                                // await goto(`/u:${$page.data.user?.username}/entry/${result.data?.entryId}`)
                                notifications.notify({
                                    title: "Book saved",
                                    message: "Book saved successfully into inbox",
                                    type: "success",
                                })
                                busy = false;
                                saved = true;
                                setTimeout(() => {
                                    bookmarked = true;
                                }, 2000);
                                return
                            }
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
						<Button type="submit" disabled={busy} className="self-start flex items-center space-x-2">
							{#if busy}
								<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
                                <span>Saving…</span>
                            {:else if saved}
                                <Icon name="checkCircleMini" className="h-4 w-4 fill-current" />
                                <span>Saved!</span>
							{:else}
								<span>Save to Inbox</span>
							{/if}
						</Button>
					{/if}
				</form>
			{/if}
		</div>
		<div class="relative overflow-hidden text-sm ">
			<div class="prose prose-stone text-sm  leading-normal  dark:prose-invert">
				{@html description}
			</div>
		</div>
	</div>
</div>

<style>
	.book-cover {
		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.1) 3px,
			rgba(255, 255, 255, 0.5) 5px,
			rgba(255, 255, 255, 0.25) 7px,
			rgba(255, 255, 255, 0.25) 10px,
			transparent 12px,
			transparent 16px,
			rgba(255, 255, 255, 0.25) 17px,
			transparent 22px
		);
		/* box-shadow: inset -1px 1px 2px rgba(255, 255, 255, 0.5); */
	}
</style>
