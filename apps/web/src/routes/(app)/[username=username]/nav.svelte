<script lang="ts">
	import { page } from '$app/stores';
	import ColResizer from '$lib/client/components/col-resizer.svelte';
	import { Avatar } from '@margins/ui';
	export let width: number;
</script>

<nav class="relative flex h-full flex-col">
	<div class="px-3.5 pt-2">
		<div class="flex h-10 w-full items-center justify-between">
			<span class="flex">
				<Avatar.Root>
					<Avatar.Image src={$page.data.user?.avatar} alt="avatar" />
					<Avatar.Fallback>
						{$page.data.user?.username?.[0]?.toUpperCase()}
					</Avatar.Fallback>
				</Avatar.Root>
				{$page.data.user?.username}
			</span>

			<span> search </span>
		</div>
	</div>
	<ColResizer
		min={220}
		max={330}
		class="before:bg-border absolute inset-y-0 -right-[3px] z-[97] w-2 cursor-col-resize before:absolute before:inset-y-0 before:left-0.5 before:z-[-1] before:w-0.5 before:opacity-0 before:transition hover:before:opacity-100 data-[is-dragging=true]:before:opacity-100"
		bind:width
	/>
</nav>
