<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import type { Recipe } from "$lib/web-parser/recipe";
	import dayjs from "$lib/dayjs";
	import H1 from "$lib/components/atoms/H1.svelte";
	import { reading_sidebar } from "../entries/stores";

	export let recipe: Recipe;
	const boldIngredientQuantity = (ingredient: string) => {
		// replace matched quantity with bolded quantity
		return ingredient.replace(/(\d+)(\s+)(\w+)/, "<b>$1</b>$2$3");
	};

	const image = (img: Recipe["image"]): string => {
		if (typeof img === "string") return img;
		if (Array.isArray(img)) return image(img[0]);
		if (typeof img === "object") return img.url || "";
		return "";
	};
</script>

<div class="mx-auto max-w-3xl flex flex-col gap-4 divide-y divide-border py-6">
	<div class="meta space-y-4 md:space-y-6">
		<img class="max-h-48 sm:max-h-56 w-full overflow-hidden object-cover" src={image(recipe.image)} alt="" />
		<H1 xl={true} class="">{recipe.name}</H1>
        {#if recipe.author}
            <p class="text-sm text-gray-500">{Array.isArray(recipe.author) ? recipe.author.map(a => a.name).join(", ") : recipe.author.name}</p>
        {/if}
		<p class="prose">{recipe.description}</p>

		<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2">
			<div class="flex flex-col gap-0.5">
				<dt class="text-xs uppercase"><Muted>Yield</Muted></dt>
				<dd class="flex grow items-center">{recipe.recipeYield}</dd>
			</div>
			{#if recipe.totalTime}
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs uppercase"><Muted>Time</Muted></dt>
					{#if typeof recipe.totalTime === "string"}
						<dd class="flex grow items-center">{dayjs.duration(recipe.totalTime).format("H[h] mm[m]")}</dd>
					{/if}
				</div>
			{/if}
		</dl>
	</div>
	{#if !$reading_sidebar.active}
		<div class="space-y-4 pt-4">
			<h2>Ingredients</h2>
			<ul class="space-y-2">
				{#each recipe.recipeIngredient || [] as ingredient}
					<li>{@html boldIngredientQuantity(ingredient)}</li>
				{/each}
			</ul>
		</div>
	{/if}
	<div class="space-y-4 pt-4">
		<h2>Instructions</h2>
		<ol class="prose lg:prose-lg xl:prose-xl list-decimal">
			{#each recipe.recipeInstructions || [] as instruction}
				{#if "text" in instruction}
					<li>{instruction.text}</li>
				{/if}
			{/each}
		</ol>
		<!-- {JSON.stringify(recipe)} -->
	</div>
</div>
