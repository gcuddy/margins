<script lang="ts">
	import { page } from '$app/stores';
	import ColResizer from '$lib/client/components/col-resizer.svelte';
	import { Avatar, Button, Dropdown } from '@margins/ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Search from 'lucide-svelte/icons/search';
	export let width: number;
</script>

<nav class="relative flex h-full flex-col">
	<div class="px-3.5 pt-2">
		<div class="flex h-10 w-full items-center justify-between">
			<span class="flex">
				<Dropdown.Root>
					<Dropdown.Trigger
						class="hover:bg-glass/5 data-[state=open]:bg-glass/5 flex items-center gap-2 rounded-lg p-1.5"
					>
						<Avatar.Root class="h-6 w-6">
							<Avatar.Image src={$page.data.user?.avatar} alt="avatar" />
							<Avatar.Fallback class="text-xs">
								{$page.data.user?.username?.[0]?.toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
						<span class="text-sm font-medium">{$page.data.user?.username}</span>
						<ChevronDown class="text-muted-foreground h-4 w-4" />
					</Dropdown.Trigger>
					<Dropdown.Content
						transitionConfig={{
							duration: 75,
							start: 0.97,
							x: -4,
							y: -4,
						}}
					>
						<Dropdown.Item>Profile</Dropdown.Item>
						<Dropdown.Item>Settings</Dropdown.Item>
						<Dropdown.Item>Logout</Dropdown.Item>
					</Dropdown.Content>
				</Dropdown.Root>
			</span>

			<Button variant="ghost" size="icon">
				<Search class="text-muted-foreground h-4 w-4" />
			</Button>
		</div>
	</div>
	<ColResizer
		min={220}
		max={330}
		class="before:bg-border absolute inset-y-0 -right-[3px] z-[97] w-2 cursor-col-resize before:absolute before:inset-y-0 before:left-1 before:z-[-1] before:w-0.5 before:opacity-0 before:transition hover:before:opacity-100 data-[is-dragging=true]:before:opacity-100"
		bind:width
	/>
</nav>
