<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import Combobox from '$lib/components/helpers/Combobox.svelte';
	import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
	import type { ArticleWithTags } from '$lib/types';

	// import TagInput from '$lib/components/TagInput.svelte';
	import type { Tag } from '@prisma/client';

	export let article: ArticleWithTags;
	export let tags: Tag[];
	console.log({ article });
</script>

<h1>Tags for {article.title}</h1>

<!-- <TagInput
	endpoint="/{article.id}/tags"
	{tags}
	selectedTags={article.tags}
	articleIds={[article.id]}
/> -->

<TagInputCombobox allTags={tags} articles={[article]} />
