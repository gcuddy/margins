<script lang="ts">
	import { notifications, type INotification } from '$lib/stores/notifications';
	import { gentleFly } from '$lib/transitions';
	import { flip } from 'svelte/animate';
	import { fade, slide, fly } from 'svelte/transition';
	import Icon from './helpers/Icon.svelte';
	$: console.log($notifications);

	const getBgColor = (type: INotification['type']) => {
		if (type === 'success') {
			return 'bg-lime-400 bg-opacity-90';
		} else if (type === 'error') {
			return 'bg-red-400 bg-opacity-90';
		} else {
			return 'bg-gray-800/95 text-stone-100 ring-1 ring-stone-800';
		}
	};
</script>

<div class="fixed bottom-5 right-5 z-[99] space-y-3">
	{#each $notifications as { message, type, id, title, link } (id)}
		<!-- todo: nicer transition -->
		<div
			animate:flip
			transition:fade
			class="relative w-80 max-w-md rounded-md border border-gray-100 bg-white p-3 text-sm shadow-md ring-1 ring-black/5 dark:shadow-slate-900/50"
		>
			<div class="flex space-x-2">
				<Icon
					name={type === 'info'
						? 'informationCircleSolid'
						: type === 'success'
						? 'checkCircleSolid'
						: 'xCircleSolid'}
					className="h-4 w-4 {type === 'success'
						? 'fill-lime-500'
						: type === 'error'
						? 'fill-red-500'
						: 'fill-primary-500'}"
				/>
				<div class="space-y-1">
					{#if title}
						<span class="text-sm font-medium text-gray-800">{title}</span>
					{/if}
					{#if typeof message === 'string'}
						<p>{@html message}</p>
					{:else}
						<svelte:component this={message} />
					{/if}
					{#if link}
						<div>
							<a href={link.href}>{link.text}</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>
