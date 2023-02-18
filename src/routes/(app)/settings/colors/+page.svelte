<script lang="ts">
	import { enhance } from "$app/forms";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import { Color } from "@prisma/client";
	import type { PageData } from "./$types";
	export let data: PageData;
	$: console.log({ data });
</script>

<ul class="flex flex-col gap-8">
	{#each Object.values(Color) as color}
		{@const description = data.color_descriptions?.find((d) => d.color === color)}
		<form
			method="post"
			use:enhance={() => {
				return ({ update }) => {
					update({ reset: false });
				};
			}}
		>
			<input type="hidden" name="color" value={color} />
			<li class="flex items-center gap-2">
				<div
					style:background="var(--highlight-{color.toLowerCase()})"
					class="h-10 w-10 shrink-0 rounded-full"
				/>
				<GenericInput name="description" class="text-lg" value={description?.description ?? color} />
				<button type="submit">Submit</button>
			</li>
		</form>
	{/each}
</ul>
