<script lang="ts">
	import Heading from '$lib/ui/heading.svelte';
	import { Pane, type PaneAPI } from 'paneforge';
	import Text from '$lib/ui/text.svelte';
	import type { Entry } from '@margins/api2/src/Domain/Entry';
	import { Option as O } from 'effect';
	import Option from '../stream/option.svelte';
	import { Heart } from 'svelte-radix';
	import IconButton from '$lib/ui/icon-button.svelte';
	import ResizablePaneGroup from '$lib/ui/resizable-pane-group.svelte';
	import ResizableHandle from '$lib/ui/resizable-handle.svelte';

	const { entry }: { entry: Entry } = $props();

	let inspectorPane = $state() as PaneAPI;
</script>

{#snippet title()}
	{entry.title.pipe(O.getOrElse(() => '(no title)'))}
{/snippet}

<ResizablePaneGroup direction="horizontal">
	<Pane defaultSize={80}>
		<div class="flex flex-col h-full grow relative min-w-0">
			<div class="py-2 border-b h-12 px-4 shrink-0">
				<IconButton>
					<Heart size={20} />
				</IconButton>
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
	>
		<aside class="w-full h-full">
			Title {@render title()}
		</aside>
	</Pane>
</ResizablePaneGroup>
