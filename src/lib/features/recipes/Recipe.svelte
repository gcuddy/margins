<script lang="ts">
	import type { Recipe } from "$lib/web-parser/recipe";

	export let recipe: Recipe;

    const boldIngredientQuantity = (ingredient: string) => {
        // replace matched quantity with bolded quantity
        return ingredient.replace(/(\d+)(\s+)(\w+)/, '<b>$1</b>$2$3');
    };
</script>

{#if recipe.recipeIngredient}
	<ul class="space-y-2">
		{#each recipe.recipeIngredient as ingredient}
			<li>{@html boldIngredientQuantity(ingredient)}</li>
		{/each}
	</ul>
{/if}

<!-- {#if recipe.recipeInstructions}
	<h2>Steps</h2>
	<ol>
		{#each recipe.recipeInstructions as instruction}
			<li>{instruction?.text}</li>
		{/each}
	</ol>
{/if} -->
