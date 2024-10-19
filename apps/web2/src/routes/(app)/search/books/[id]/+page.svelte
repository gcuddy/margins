<script lang="ts">
	import GoogleBook from './google-book.svelte';

	import ResizablePaneGroup from '$lib/ui/resizable-pane-group.svelte';
	import ResizableHandle from '$lib/ui/resizable-handle.svelte';
	import * as DataList from '$lib/ui/data-list';
	import PanelRight from 'lucide-svelte/icons/panel-right';
	import { Pane, type PaneAPI } from 'paneforge';
	import IconButton from '$lib/ui/icon-button.svelte';
	import Button from '$lib/ui/button.svelte';
	import { Effect } from 'effect';
	import { Replicache } from '$lib/services/Replicache';
	import { runtime } from '$lib/runtime';

	let { data } = $props();

	let inspectorPane = $state<PaneAPI>();
	let inspectorIsCollapsed = $state(false);

	const save = () => {
		console.log('save')
		Effect.gen(function* () {
			const replicache = yield* Replicache;
			console.log('hello', { replicache });
			const a = yield* Effect.promise(() => replicache.mutate.saveBook({ book: 'hello' }));
		}).pipe(runtime.runPromise);
	}
</script>

<ResizablePaneGroup direction="horizontal">
	<Pane defaultSize={80}>
		<div class="flex flex-col h-full grow relative min-w-0">
			<div class="py-2 justify-between flex items-center border-b h-12 px-4 shrink-0">
				<div></div>
				<Button size="2" variant="ghost" onclick={save}>Save</Button>
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
				<GoogleBook id={data.id} />
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
				<!-- <Text size="1">inspector / annotations / headings</Text> -->
			</div>
			<div class="overflow-y-auto relative grow px-4 py-4"></div>
		</aside>
	</Pane>
</ResizablePaneGroup>
