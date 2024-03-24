<script lang="ts">
	import Clamp from '$components/Clamp.svelte';
	import { isJSONContent, render_html } from '$components/ui/editor/utils';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { ago, formatDuration, now } from '$lib/utils/date';
	import type { Annotation } from '@prisma/client';

	export let annotation: Pick<
		Annotation,
		'body' | 'createdAt'
	> & {
        contentData: unknown | null;
        target?: unknown | null;
    }
</script>

<div class="flex flex-col gap-1 rounded-lg border px-2 py-2 text-xs">
	<div class="flex items-center gap-2 text-muted-foreground">
		<!-- <span class="font-medium">
            {annotation.username}
        </span> -->
		<time datetime={annotation.createdAt.toString()}>
			{ago(new Date(annotation.createdAt), $now)}
		</time>
	</div>
	<div class="space-y-1 font-normal break-words">
		{#if annotation.target}
			{@const text_quote = getTargetSelector(
				annotation.target,
				'TextQuoteSelector',
			)}
			{@const fragment = getTargetSelector(
				annotation.target,
				'FragmentSelector',
			)}
			{#if text_quote}
				<Clamp clamp={2} class="border-l px-3 italic">
					{text_quote.exact}
				</Clamp>
			{:else if fragment}
				{@const value = fragment.value.split('=')[1]}
				<!-- TODO: click to jump to timestamp -->
				{#if value}
					<span class="text-xs text-muted-foreground bg-muted p-0.5 rounded">
						{formatDuration(Number(value), 's', true, ':')}
					</span>
				{/if}
			{/if}
		{/if}
		{#if annotation.body}
			<Clamp clamp={2}>
				{annotation.body}
			</Clamp>
		{:else if annotation.contentData && isJSONContent(annotation.contentData)}
			{@html render_html(annotation.contentData)}
		{/if}
	</div>
</div>
