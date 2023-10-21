<script lang="ts">
	import { createTableOfContents } from '@melt-ui/svelte';

	const {
		elements: { item },
		states: { activeHeadingIdxs, headingsTree },
	} = createTableOfContents({
		selector: '#article',
	});

	import Tree from './TOCTree.svelte';
</script>

<div class="space-y-2">
	<p class="font-semibold leading-none tracking-tight">On This Page</p>
	<nav>
		<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} {item} />
	</nav>
</div>
