<script lang="ts">
	import { page } from "$app/stores";
	import EntryOperations from "$lib/components/EntryOperations.svelte";
	import AspectRatio from "$lib/components/ui/AspectRatio.svelte";
	import { formatDate } from "$lib/utils/date";
	import type { Entry } from "@prisma/client";
	import { Image } from "@unpic/svelte";

	type EntryItemProps = Pick<
		Entry,
		"id" | "title" | "published" | "author" | "type" | "uri" | "image"
	>;
	export let entry: EntryItemProps;
	$: username = $page.params.username ?? undefined;

	$: fallback_image = `https://icon.horse/icon?uri=${entry.uri}`;
</script>

<div class="flex items-center justify-between p-4">
	<div class="flex items-center gap-4">
		<div class="w-10 h-10 overflow-hidden rounded-md">
			<Image
				class="object-cover w-10 aspect-square hover:scale-105"
				src={entry.image || fallback_image}
				on:error={(e) => {
					if (e.target && "src" in e.target) {
						e.target.src = fallback_image;
					}
				}}
				alt=""
				layout="constrained"
				width={40}
				height={40}
			/>
            </div>
		<!-- <img

		/> -->
		<div class="grid gap-1">
			<a
				href="{username ? `/u:${username}` : ''}/entry/{entry.id}"
				class="font-semibold hover:underline"
			>
				{entry.title}
			</a>
			<div>
				{#if entry.published}
					<p class="text-sm text-slate-600">
						{formatDate(entry.published?.toDateString())}
					</p>
				{/if}
			</div>
		</div>
	</div>
	<EntryOperations entry={{ id: entry.id, title: entry.title }} />
</div>
