<script lang="ts">
	import { enhance, SubmitFunction } from "$app/forms";
	import { page } from "$app/stores";
	import { modals } from "$lib/stores/modals";
	import type { SmartList } from "@prisma/client";
	import ListEdit from "./ListEdit.svelte";
	export let view: SmartList;
	let pending = false;
	export let submitFunction: SubmitFunction = () => {
		pending = true;
		return async ({ result, update }) => {
			console.log({ result });
			await update();
			pending = false;
			modals.close({
				id: "view-entry",
			});
			// invalidate("app:collections");
		};
	};
</script>

<form method="post" action="/u:{$page.params.username}/smart/{view.id}" use:enhance={submitFunction}>
	<ListEdit list={view} {pending} />
</form>
