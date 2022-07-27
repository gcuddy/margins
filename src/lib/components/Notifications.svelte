<script lang="ts">
	import { notifications, type INotification } from '$lib/stores/notifications';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
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

<div class="fixed top-5 right-5 z-50 space-y-3">
	{#each $notifications as { message, type, id } (id)}
		<div
			animate:flip
			transition:fade
			class="rounded-lg {getBgColor(
				type
			)} max-w-xs p-3 text-sm tracking-wide shadow-xl dark:shadow-slate-900/50"
		>
			<p>{message}</p>
		</div>
	{/each}
</div>
