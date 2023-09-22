<script lang="ts">
	import * as Avatar from '$components/ui/avatar';
	import type { EntryDetail } from '$lib/queries/server';
	import { ago, formatDate, normalizeTimezone, now } from '$lib/utils/date';
	import { CheckCircle } from 'lucide-svelte';
	import StatusIcon from './StatusIcon.svelte';

	export let entry: EntryDetail;
	$: history = entry.history;
</script>

{#if history}
	<div class="flex gap-4 flex-col relative">
		{#if history.length > 1}
			<!-- "Connector" line -->
			<div class="absolute top-0 -bottom-1 left-3 w-px bg-border -z-10"></div>
		{/if}
		{#each history.sort((a, b) => {
			const aTime = new Date(normalizeTimezone(a.createdAt));
			const bTime = new Date(normalizeTimezone(b.createdAt));
			return aTime > bTime ? 1 : aTime < bTime ? -1 : 0;
		}) as historyItem (historyItem.id)}
			<div class="flex items-center min-w-0 gap-4">
				{#if historyItem.toStatus}
					<StatusIcon status={historyItem.toStatus} />
				{:else if historyItem.finished}
					<CheckCircle class="h-6 w-6 text-green-500" />
				{:else}
					<Avatar.Root class="h-6 w-6">
						<Avatar.Image src={historyItem.avatar} alt={historyItem.username} />
						<Avatar.Fallback>
							{historyItem.username.at(0)?.toUpperCase()}
						</Avatar.Fallback>
					</Avatar.Root>
				{/if}
				<div class="flex flex-auto gap-2 min-w-0 text-xs text-muted-foreground">
					{#if historyItem.toStatus}
						<span>
							{historyItem.username}
							saved {entry.type} to "{historyItem.toStatus}"
						</span>
						<span class="text-muted-foreground/80 text-xs">·</span>
						<span>
							{ago(new Date(normalizeTimezone(historyItem.createdAt)), $now)}
						</span>
                        {:else if historyItem.finished}
						<span>
							{historyItem.username}
							marked as finished
						</span>
						<span class="text-muted-foreground/80 text-xs">·</span>
						<span>
							{ago(new Date(normalizeTimezone(historyItem.createdAt)), $now)}
						</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
