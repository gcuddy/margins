<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import type { Recipe } from "$lib/web-parser/recipe";
	import dayjs from "$lib/dayjs";
	import H1 from "$lib/components/atoms/H1.svelte";
	import { reading_sidebar } from "../entries/stores";

	export let recipe: Recipe;
	const boldIngredientQuantity = (ingredient: string) => {
		// replace matched quantity with bolded quantity
		return ingredient.replace(/((?:\d\/)?\d+)(\s+)(\w+)/, "<b>$1</b>$2$3");
	};

	const image = (img: Recipe["image"]): string => {
		if (typeof img === "string") return img;
		if (Array.isArray(img)) return image(img[0]);
		if (typeof img === "object") return img.url || "";
		return "";
	};

	const formatTime = (time: string) => {
		const duration = dayjs.duration(time);
		console.log({ duration });
		console.log(duration.asHours());
		const hours = duration.asHours();
		const minutes = hours ? duration.asMinutes() % 60 : duration.asMinutes();
		const parts = [];
		if (hours) parts.push(`${hours}h`);
		if (minutes) parts.push(`${minutes}m`);
		return parts.join(" ");
		// const hours = duration.hours();
		// const minutes = duration.minutes();
		// const seconds = duration.seconds();
		// const parts = [];
		// if (hours) parts.push(`${hours}h`);
		// if (minutes) parts.push(`${minutes}m`);
		// if (seconds) parts.push(`${seconds}s`);
		// return parts.join(" ");
	};
</script>

<div class="mx-auto flex max-w-3xl flex-col gap-4 divide-y divide-border py-6">
	<div class="meta space-y-4 md:space-y-6">
		<img class="max-h-48 w-full overflow-hidden object-cover sm:max-h-56" src={image(recipe.image)} alt="" />
		<H1 xl={true} class="">{recipe.name}</H1>
		{#if recipe.author}
			<p class="text-sm text-gray-500">
				{Array.isArray(recipe.author) ? recipe.author.map((a) => a.name).join(", ") : recipe.author.name}
			</p>
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
						<dd class="flex grow items-center">{formatTime(recipe.totalTime)}</dd>
						<!-- <dd class="flex grow items-center">{dayjs.duration(recipe.totalTime).format("H[h] mm[m]")}</dd> -->
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
		<ol class="prose list-decimal lg:prose-lg xl:prose-xl">
			{#each recipe.recipeInstructions || [] as instruction}
				{#if "text" in instruction}
					<li>{instruction.text}</li>
				{/if}
			{/each}
		</ol>
		<!-- {JSON.stringify(recipe)} -->
	</div>
</div>
