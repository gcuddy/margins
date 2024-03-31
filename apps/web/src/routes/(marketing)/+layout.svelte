<script lang="ts">
	import '@fontsource/instrument-serif';
	import '@fontsource/instrument-serif/400-italic.css';
	import { Button, Github, Logo } from '@margins/ui';
	import Header from './header.svelte';
	import ThemeToggle from './theme-toggle.svelte';

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
	<footer class="bg-trasparent space-y-6 py-16 dark:bg-transparent">
		<div
			class="mx-auto flex max-w-5xl items-center justify-between space-y-4 px-3 sm:px-6"
		>
			<div class="text-muted-foreground flex items-center justify-end gap-2">
				<span
					>Built by <a class="underline" href="https://guscuddy.com">Gus</a> in Brooklyn.</span
				>
			</div>
			<div class="text-muted-foreground flex items-center justify-end gap-2">
				<ThemeToggle />
				<a
					class="hover:text-foreground transition"
					href="https://github.com/gcuddy/margins"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Github class="h-5 w-5" />
				</a>
			</div>
		</div>
	</footer>
</div>

<style>
	:root {
		--header-height: 64px;
	}
</style>
