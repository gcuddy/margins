<script lang="ts">
	import AnnotationInput from '$lib/components/AnnotationInput.svelte';
	import type { Article } from '@prisma/client';
	import type { PageData } from './$types';
	export let data: PageData;
	let { article } = data;
</script>

<div class="mx-auto w-full max-w-3xl">
	<h1>New annotation for {article.title}</h1>
	<AnnotationInput articleId={article.id} />
</div>
