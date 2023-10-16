<script lang="ts">
	import {
		type createTableOfContents,
		melt,
		type TableOfContentsItem,
	} from '@melt-ui/svelte';
	import { tick } from 'svelte';

	export let tree: Array<TableOfContentsItem> = [];
	export let activeHeadingIdxs: Array<number>;

	export let item: ReturnType<typeof createTableOfContents>['elements']['item'];

	export let level = 1;
</script>

<ul class="m-0 list-none {level !== 1 ? 'pl-4' : ''}">
	{#if tree && tree.length}
		{#each tree as heading, i (i)}
			<li class="mt-0 pt-2">
				<a
					on:click|preventDefault={() => {
						// wait for sheet to close
						setTimeout(() => {
							tick().then(() => {
								heading.node.scrollIntoView({
									behavior: 'smooth',
									block: 'start',
								});
							});
						}, 200);
					}}
					href="#{heading.id}"
					use:melt={$item(heading.id)}
					class="inline-flex items-center justify-center gap-1 no-underline transition-colors
             hover:!text-primary text-muted-foreground data-[active]:text-primary"
				>
					<!--
              Along with the heading title, the original heading node
              is also passed down, so you can display headings
              however you want.
            -->
					{heading.title}
				</a>
				{#if heading.children && heading.children.length}
					<svelte:self
						tree={heading.children}
						level={level + 1}
						{activeHeadingIdxs}
						{item}
					/>
				{/if}
			</li>
		{/each}
	{/if}
</ul>
