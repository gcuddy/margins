<script lang="ts">
	import Heading from '$lib/ui/heading.svelte';
	import { Pane, type PaneAPI } from 'paneforge';
	import Text from '$lib/ui/text.svelte';
	import type { Entry } from '@margins/api2/src/Domain/Entry';
	import { Option as O, DateTime } from 'effect';
	import Option from '../stream/option.svelte';
	import { Heart } from 'svelte-radix';
	import IconButton from '$lib/ui/icon-button.svelte';
	import ResizablePaneGroup from '$lib/ui/resizable-pane-group.svelte';
	import ResizableHandle from '$lib/ui/resizable-handle.svelte';
	import * as DataList from '$lib/ui/data-list';
	import PanelRight from 'lucide-svelte/icons/panel-right';

	const { entry }: { entry: Entry } = $props();

	let inspectorPane = $state<PaneAPI>();
	let inspectorIsCollapsed = $state(false);
</script>

{#snippet title()}
	{entry.title.pipe(O.getOrElse(() => '(no title)'))}
{/snippet}

<ResizablePaneGroup direction="horizontal">
	<Pane defaultSize={80}>
		<div class="flex flex-col h-full grow relative min-w-0">
			<div class="py-2 justify-between flex items-center border-b h-12 px-4 shrink-0">
				<IconButton>
					<Heart size={20} />
				</IconButton>
				{#if inspectorIsCollapsed}
					<IconButton
						variant="ghost"
						color="gray"
						onclick={() => {
							inspectorPane?.expand();
						}}
					>
						<PanelRight />
					</IconButton>
				{/if}
			</div>
			<div class="overflow-y-auto relative grow">
				<article class="max-w-prose space-y-12 mx-auto md:px-9 sm:px-7 xs:px-6 px-5 py-20">
					<header class="flex flex-col justify-center">
						<Heading size="7" class="text-center max-w-prose text-pretty">
							{@render title()}
						</Heading>
					</header>

					<section class="max-w-prose mx-auto prose prose-gray">
						<Option option={entry.html}>
							{#snippet some(html)}
								{@html html}
							{/snippet}
							{#snippet none()}
								(no content)
							{/snippet}
						</Option>
					</section>
				</article>
			</div>
		</div>
	</Pane>
	<ResizableHandle />
	<!-- Inspector -->
	<Pane
		defaultSize={20}
		minSize={15}
		maxSize={30}
		collapsible
		collapsedSize={0}
		bind:pane={inspectorPane}
		onCollapse={() => (inspectorIsCollapsed = true)}
		onExpand={() => (inspectorIsCollapsed = false)}
	>
		<aside class="w-full h-full flex flex-col">
			<div class="flex items-center h-12 border-b shrink-0 px-4 py-2">
				<Text size="1">inspector / annotations / headings</Text>
			</div>
			<div class="overflow-y-auto relative grow px-4 py-4">
				<DataList.Root orientation="vertical" size="2">
					<DataList.Item>
						<DataList.Label>Title</DataList.Label>
						<DataList.Value>{@render title()}</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>Author</DataList.Label>
						<DataList.Value>
							{entry.author.pipe(O.getOrElse(() => '(unknown)'))}
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>Image</DataList.Label>
						<DataList.Value>
							<Option option={entry.image}>
								{#snippet some(image)}
									<img src={image} alt="" />
								{/snippet}
								{#snippet none()}
									(no image)
								{/snippet}
							</Option>
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>Type</DataList.Label>
						<DataList.Value>
							<!-- TODO!  -->
							{entry.type ?? 'Article'}
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>Description</DataList.Label>
						<DataList.Value>
							{entry.summary.pipe(O.getOrElse(() => '(no description)'))}
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>Published</DataList.Label>
						<DataList.Value>
							<Option option={entry.published}>
								{#snippet some(published)}
									{published.pipe(DateTime.formatLocal)}
								{/snippet}
								{#snippet none()}
									(unknown)
								{/snippet}
							</Option>
						</DataList.Value>
					</DataList.Item>
				</DataList.Root>
			</div>
		</aside>
	</Pane>
</ResizablePaneGroup>
