<script lang="ts">
	import { icons } from "$lib/features/entries/utils";
	import { DocumentType } from "@prisma/client";
	import GenericListbox from "../helpers/GenericListbox.svelte";
	import Icon from "../helpers/Icon.svelte";
	const types = Object.values(DocumentType);
	export let allowedTypes: DocumentType[] = ["article", "bookmark", "recipe"];
	export let selected = allowedTypes[0];
	$: console.log({ allowedTypes, selected });
	// const icons: Record<DocumentType, IconName> = {
	// 	bookmark: "bookmark",
	// 	article: "newspaper",
	// 	recipe: "chef",
	// 	tweet: "tweet",
	//     audio: "musicNote",
	//     image: ""
	// };
</script>

<GenericListbox values={allowedTypes} bind:value={selected} let:value name="type">
	<svelte:fragment slot="button" let:value>
		<div class="flex items-center gap-2 text-sm">
			<Icon name={icons[value]} className="h-4 w-4 stroke-gray-500" />
			<span>{value}</span>
		</div>
	</svelte:fragment>
	<div class="flex items-center gap-3 text-sm">
		<Icon name={icons[value]} className="h-4 w-4 stroke-gray-500" />
		<span>{value}</span>
	</div>
</GenericListbox>
