<script lang="ts">
	import { notifications, type INotification } from "$lib/stores/notifications";
	import { flip } from "svelte/animate";
	import { fade } from "svelte/transition";
	import ChosenIcon from "./ChosenIcon.svelte";
	import Icon from "./helpers/Icon.svelte";
	$: console.log($notifications);

	const getBgColor = (type: INotification["type"]) => {
		if (type === "success") {
			return "bg-lime-400 bg-opacity-90";
		} else if (type === "error") {
			return "bg-red-400 bg-opacity-90";
		} else {
			return "bg-gray-800/95 text-stone-100 ring-1 ring-stone-800";
		}
	};
</script>

<div class="fixed bottom-5 right-5 z-[99] space-y-3">
	{#each $notifications as { message, type, id, title, link, icon } (id)}
		<!-- todo: nicer transition -->
		<div
			animate:flip
			transition:fade
			class="relative w-80 max-w-md rounded-md border border-gray-100 bg-white p-3 text-sm shadow-md ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex space-x-2">
				{#if icon}
					{#if typeof icon === "string"}
						<Icon name={icon} />
					{:else}
						<ChosenIcon chosenIcon={icon} />
					{/if}
				{:else}
					<Icon
						name={type === "info"
							? "informationCircleSolid"
							: type === "success"
							? "checkCircleSolid"
							: "xCircleSolid"}
						className="h-4 w-4 self-start relative top-px {type === 'success'
							? 'fill-lime-500'
							: type === 'error'
							? 'fill-red-500'
							: 'fill-primary-500'}"
					/>
				{/if}
				<div class="space-y-1">
					{#if title}
						<span class="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</span>
					{/if}
					{#if typeof message === "string"}
						<div>{@html message}</div>
					{:else if message}
						<svelte:component this={message} />
					{/if}
					{#if link}
						<div>
							<a href={link.href}>{link.text}</a>
						</div>
					{/if}
				</div>
			</div>
			<button class="absolute top-1 right-1 cursor-default" on:click={() => notifications.remove(id)}>
				<Icon name="xSolid" className="h-4 w-4 fill-current" />
			</button>
		</div>
	{/each}
</div>
