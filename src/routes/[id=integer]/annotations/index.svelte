<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { scale } from 'svelte/transition';
	import Annotation from '$lib/components/Annotation.svelte';
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import type { ArticleWithAnnotations } from '$lib/types';
	import { modals } from '$lib/stores/modals';
	import AnnotationInput from '$lib/components/AnnotationInput.svelte';
	export let article: ArticleWithAnnotations;
</script>

<h1>Annotations for <a href="/{article.id}">{article.title}</a></h1>

<Form
	action="/{article.id}/annotations/new"
	disableJs={false}
	on:submit={(e) => {
		e.preventDefault();
	}}
	><Button
		type="submit"
		className="shadow-lg"
		on:click={() => {
			const i = modals.open(AnnotationInput, {
				articleId: article.id
			});
		}}
		><div class="inline-flex items-center">
			<Icon name="pencil" className="h-5 w-5 mr-1" />New Note
		</div></Button
	></Form
>

{#if article.annotations.length}
	{#each article.annotations as annotation (annotation.id)}
		<div animate:flip transition:scale>
			<div>
				<p>{annotation.text}</p>
				<p>{annotation.createdAt}</p>
				<a
					on:click={(e) => {
						e.preventDefault();
						modals.open(AnnotationInput, {
							action: `/${article.id}/annotations/${annotation.id}`,
							method: 'patch',
							value: annotation.text,
							articleId: article.id
						});
					}}
					href="/{article.id}/annotations/{annotation.id}">Edit</a
				>
				<Form
					action="/{article.id}/annotations/{annotation.id}"
					method="delete"
					invalidate="/{article.id}/annotations"
					done={() => invalidate(`/${article.id}/annotations/${annotation.id}`)}
					><button><Icon name="trash" /><span class="sr-only">Trash</span></button></Form
				>
			</div>
		</div>
	{/each}
{:else}
	<p>No annotations yet!</p>
{/if}
