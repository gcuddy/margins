<script lang="ts">
	import type { ArticleWithTags } from '$lib/types';
	import type { Tag } from '@prisma/client';
	import TagInputCombobox from './TagInputCombobox.svelte';
	export let articles: ArticleWithTags[];
	export let allTags: Tag[];
</script>

<div class="p-4">
	<TagInputCombobox size="lg" {articles} {allTags} />
</div>
