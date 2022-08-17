<script lang="ts">
	import type { Article } from '@prisma/client';
	export let article: Article;
	import AnnotationInput from '$lib/components/AnnotationInput.svelte';
</script>

<div class="mx-auto w-full max-w-3xl">
	<h1>New annotation for {article.title}</h1>
	<AnnotationInput articleId={article.id} />
</div>
