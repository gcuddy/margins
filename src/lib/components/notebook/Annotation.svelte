<script lang="ts">
	import { MoreHorizontal } from 'lucide-svelte';
	import MarkdownIt from 'markdown-it';
	import { toast } from 'svelte-sonner';

	import Editor from '$components/ui/editor/Editor.svelte';
	import type { TargetSchema } from '$lib/annotation';
// import Avatar from '$components/ui/avatar/avatar.svelte';
	import { Muted, Small } from '$lib/components/ui/typography';
	import type { AnnotationWithEntry } from '$lib/db/selects';
	import { generateTextFragmentLink, getTargetSelector } from '$lib/utils/annotations';
	import { getId, getType } from '$lib/utils/entries';
	import { cn } from '$lib/utils/tailwind';

	import { buttonVariants } from '../ui/Button.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';

	const md = new MarkdownIt();
	let className = '';
	export { className as class };
	export let annotation: AnnotationWithEntry;

	type AnnotationWithTarget = AnnotationWithEntry & {
		target: TargetSchema;
	};

	function hasTarget(annotation: AnnotationWithEntry): annotation is AnnotationWithTarget {
		return !!annotation.target && 'selector' in (annotation.target as TargetSchema);
	}

	$: href = annotation.entry?.id
		? `/${getType(annotation.entry.type)}/${getId(annotation.entry)}#annotation-${
				annotation.id
		  }`
		: `/notes/${annotation.id}`;

	function copyLinkToHighlight(annotation: AnnotationWithTarget) {
		if (!annotation.entry?.uri) {return;}
		const selector = getTargetSelector(annotation.target, 'TextQuoteSelector');
		if (!selector) {return;}
		// console.log({ annotation });
		const link = generateTextFragmentLink(annotation.entry.uri, selector);
		if (link) {
			navigator.clipboard.writeText(link);
			toast.success('Copied link to highlight');
			return;
		}
		toast.error('Could not copy link to highlight');
	}
</script>

<div class={cn('max-w-xl space-y-4 rounded-md border p-6', className)}>
	<!--  -->
	<a {href} class="flex items-center gap-x-3">
		{#if annotation.entry?.id}
			<!-- <Avatar
				src={annotation.entry?.image ||
					(annotation.entry.uri
						? `https://icon.horse/icon/${getHostname(annotation.entry.uri)}`
						: undefined)}
			>
				{annotation.entry.title?.match(/[A-z]/)?.[0]}
			</Avatar> -->

			<div class="flex grow justify-between gap-x-1">
				<div class="flex flex-col">
					<Small>{annotation.entry.title}</Small>
					<Muted class="text-xs">{annotation.entry.author}</Muted>
				</div>
				<!-- <Muted class="text-xs">
				{annotation.entry_type}
			</Muted> -->
				<DropdownMenu>
					<DropdownMenuTrigger class={buttonVariants({ size: 'sm', variant: 'ghost' })}>
						<MoreHorizontal class="h-4 w-4 text-secondary-foreground" />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Use for evergreen note</DropdownMenuItem>
						{#if hasTarget(annotation) && annotation.entry?.uri && annotation.target.selector.type === 'TextQuoteSelector'}
							<DropdownMenuItem
								on:click={() => hasTarget(annotation) && copyLinkToHighlight(annotation)}
								>Copy link to highlight</DropdownMenuItem
							>
						{/if}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		{:else if annotation.title}
			{annotation.title}
		{/if}
	</a>
	{#if annotation.exact}
		<p class="break-words px-2 text-base/6 sm:px-6">
			<span class="rounded bg-yellow-400/25 px-1 py-0.5 dark:bg-yellow-300/80 dark:text-background">
				{annotation.exact}
			</span>
		</p>
	{:else if annotation.target}{/if}
	{#if annotation.body}
		<div>
			{@html md.render(annotation.body)}
		</div>
    {:else if annotation.contentData}
    <Editor content={annotation.contentData} options={{editable: false}} />
        <!-- <div>
            {@html render_html(annotation.contentData)}
        </div> -->
	{/if}
</div>
