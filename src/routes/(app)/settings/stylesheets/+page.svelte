<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Button from "$lib/components/Button.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import type { PageData } from "./$types";
	export let data: PageData;
</script>

<form class="" method="post" action="?/create" use:enhance>
	<label for="domain" class="p-1"><SmallPlus color="muted" size="xs">Domain</SmallPlus></label>
	<div class="flex items-center gap-4">
		<GenericInput class="row-span-1" placeholder="www.example.com" name="domain" id="domain" />
		<Button className="row-span-1 grow">New Stylesheet</Button>
	</div>
</form>

{#each data.stylesheets || [] as stylesheet}
	<a href="/settings/stylesheets/{stylesheet.id}">{stylesheet.domain}</a>
{/each}
