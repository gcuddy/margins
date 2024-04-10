<script lang="ts">
	import { Breadcrumb, Button } from '@margins/ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import PanelRight from 'lucide-svelte/icons/panel-right';
	import Pin from 'lucide-svelte/icons/pin';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { getEntryCtx } from './ctx.js';
	import { getShellCtx } from '../shell/ctx.js';
	import { getReplicache } from '../index.js';
	import { createId } from '@margins/lib';
	import type { Selectable } from 'kysely';
	import type { Entry } from '@margins/db/kysely/types';
	import { PinStore } from '../data/pin.js';

	export let title: string;
	export let id: string;
	export let entry: Selectable<Entry>;

	const { entryContext } = getShellCtx();
	const { isInspectorVisible } = getEntryCtx();
	const rep = getReplicache();

	$: pin = PinStore.get.watch(
		() => rep,
		() => ['Entry', entry.id],
	)();

	const nextItem = derived([entryContext], ([{ currentList: currentList }]) => {
		if (!currentList) return;
		const index = currentList.findIndex((item) => item.id === id);
		if (index === -1) return;
		if (index === currentList.length - 1) return;
		return currentList[index + 1];
	});
	const prevItem = derived([entryContext], ([{ currentList: currentList }]) => {
		if (!currentList) return;
		const index = currentList.findIndex((item) => item.id === id);
		if (index === -1) return;
		if (index === 0) return;
		return currentList[index - 1];
	});
</script>

<div class="flex min-w-0 items-center gap-3">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			{#each $entryContext.breadcrumbs as breadcrumb, i}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={breadcrumb.href}
						>{breadcrumb.text}</Breadcrumb.Link
					>
				</Breadcrumb.Item>
				{#if i !== $entryContext.breadcrumbs.length - 1}
					<Breadcrumb.Separator />
				{/if}
			{/each}
			{#if $entryContext.breadcrumbs.length > 0}
				<Breadcrumb.Separator />
			{/if}
			<Breadcrumb.Item>
				{title}
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<Button
		size="iconSmall"
		variant="ghost"
		class="text-muted-foreground hover:text-foreground stroke-[1.5]"
		data-pinned={!!$pin}
		on:click={() => {
			if ($pin) {
				rep.mutate.pin_remove({
					id: $pin.id,
				});
			} else {
				rep.mutate.pin_create({
					entryId: entry.id,
					id: createId(),
					type: 'FAVORITE',
				});
			}
		}}
	>
		<Pin
			class="group-data-[pinned=true]:fill-primary group-data-[pinned=true]:text-primary h-4 w-4"
		/>
		<span class="sr-only">Pin</span>
	</Button>
</div>
<div class="flex items-center">
	{#if $entryContext.currentList}
		<div class="flex gap-1">
			{#if $prevItem}
				<Button
					href="/u:{$page.data.user?.username}/read/{$prevItem.id}"
					variant="outline"
					size="iconSmall"
				>
					<ChevronUp class="text-muted-foreground h-4 w-4" />
				</Button>
			{/if}
			{#if $nextItem}
				<Button
					href="/u:{$page.data.user?.username}/read/{$nextItem.id}"
					variant="outline"
					size="iconSmall"
				>
					<ChevronDown class="text-muted-foreground h-4 w-4" />
				</Button>
			{/if}
		</div>
	{/if}
	<Button
		variant="ghost"
		size="iconSmall"
		on:click={() => {
			isInspectorVisible.update((v) => !v);
		}}
	>
		<PanelRight class="text-muted-foreground h-4 w-4" />
	</Button>
</div>
