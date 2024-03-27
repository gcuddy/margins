<script lang="ts">
	import '@fontsource/instrument-serif';
	import { Button, Logo } from '@margins/ui';
	import Header from './header.svelte';

	const navItems: {
		href: string;
		label: string;
	}[] = [
		{
			href: '/blog',
			label: 'Blog',
		},
		{
			href: '/login',
			label: 'Log in',
		},
	];
</script>

<div class="flex min-h-screen select-text flex-col">
	<Header>
		<div class="mx-auto h-full w-full max-w-5xl">
			<nav class="flex h-full w-full items-center justify-between space-x-4">
				<a href="/" class="flex items-center gap-2">
					<Logo class="h-[18px] w-[18px]" />
					<h3 class="text-base font-semibold tracking-tight">Margins</h3>
				</a>
				<ul class="flex h-full items-center justify-end gap-x-6">
					{#each navItems as { href, label }}
						<li class="text-sm font-semibold">
							<a {href}>{label}</a>
						</li>
					{/each}
					<li>
						<Button
							variant="default"
							href="/signup"
							class="rounded-full font-semibold">Sign up</Button
						>
					</li>
				</ul>
			</nav>
		</div>
	</Header>
	<main class="flex-1 px-3 pt-[--header-height] sm:px-6">
		<div class="mx-auto max-w-5xl">
			<slot />
		</div>
	</main>
</div>

<style>
	:root {
		--header-height: 64px;
	}
</style>
