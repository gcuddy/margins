<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import type { BookmarkSchema } from "$lib/features/entries/forms";
	import { LoaderIcon } from "lucide-svelte";
	import { superForm } from "sveltekit-superforms/client";
	import type { Validation } from "sveltekit-superforms/index";

	export let data: Validation<BookmarkSchema>;

	$: ({ form, enhance, submitting, delayed } = superForm(data, {
		resetForm: true,
	}));
	$: bookmarked = !!$form.id;
</script>

<form method="post" use:enhance action="?/bookmark">
	<input type="hidden" bind:value={$form.id} name="id" />
	<input type="hidden" bind:value={$form.entryId} name="entryId" />
	<input type="hidden" name="tmdbId" bind:value={$form.tmdbId} />
	<input type="hidden" name="googleBooksId" bind:value={$form.googleBooksId} />
	<input
		type="hidden"
		name="podcastIndexId"
		bind:value={$form.podcastIndexId}
	/>
	<slot name="input" {form} />
	<Button disabled={$submitting}>
		<span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
		{#if $delayed}
			<div>
				<LoaderIcon class="ml-2 h-4 w-4 animate-spin" />
			</div>
		{/if}
	</Button>
</form>
