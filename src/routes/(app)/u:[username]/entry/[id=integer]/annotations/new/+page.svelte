<script lang="ts">
	import AnnotationInput from '$lib/components/annotations/AnnotationInput.svelte';
	import type { Article } from '@prisma/client';
	import type { PageData } from '../../../../../../.svelte-kit/types/src/routes/[id=integer]/annotations/new/$types';
	export let data: PageData;
	let { article } = data;
</script>

<div class="mx-auto w-full max-w-3xl">
	<h1>New annotation for {article.title}</h1>
	<AnnotationInput articleId={article.id} />
</div>
