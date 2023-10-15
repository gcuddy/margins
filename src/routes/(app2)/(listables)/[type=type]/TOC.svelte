<script lang="ts">
	import { createTableOfContents } from '@melt-ui/svelte';

	const { activeHeadingIdxs, headingsTree, item } = createTableOfContents({
		selector: '#article',
	});

	import Tree from './TOCTree.svelte';
</script>

<nav>
	{#key $headingsTree}
		<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} {item} />
	{/key}
</nav>
