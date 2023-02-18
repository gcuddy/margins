<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidate } from "$app/navigation";
	import { page } from "$app/stores";
	import { modals } from "$lib/stores/modals";
	import type { ChosenIcon } from "$lib/types/icon";
	import { chosenIcon as chosenIconSchema } from "$lib/types/icon";
	import type { Collection } from "@prisma/client";
	import ListEdit from "./ListEdit.svelte";
	export let collection: Collection | undefined = undefined;
	let chosenIcon: ChosenIcon;
	if (collection?.icon) {
		const parsed = chosenIconSchema.safeParse(collection.icon);
		if (parsed.success) chosenIcon = parsed.data;
	}

	$: console.log({ chosenIcon });
</script>

<form
	method="post"
	action="/u:{$page.params.username}/collection"
	use:enhance={() => {
		modals.close({
			id: "collection-entry",
		});
		console.log($modals);
		return ({ result, update }) => {
			update();
			invalidate("app:collections");
		};
	}}
>
	<ListEdit list={collection} />
</form>
