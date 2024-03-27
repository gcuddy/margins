<script>
	import '@fontsource/instrument-serif';
	import { Button, Logo } from '@margins/ui';
	import Header from './header.svelte';
</script>

<div class="flex min-h-screen select-text flex-col">
	<Header>
		<div class="mx-auto h-full w-full max-w-5xl">
			<nav class="flex h-full w-full items-center justify-between space-x-4">
				<!-- <span class="logo text-4xl font-bold">Margins</span> -->
				<div class="flex items-center gap-2">
					<Logo class="h-[18px] w-[18px]" />
					<h3 class="text-base font-semibold tracking-tight">Margins</h3>
				</div>
				<ul class="flex h-full items-center justify-end space-x-4">
					<li>
						<Button
							variant="ghost"
							href="/login"
							class="font-semibold hover:bg-transparent">Login</Button
						>
					</li>
					<li>
						<Button
							variant="default"
							href="/signup"
							class="rounded-full font-semibold">Sign up</Button
						>
					</li>
					<!-- <li>
                        <Button
                            as="a"
                            href="/signup"
                            size="lg"
                            className="flex font-bold items-center gap-1 py-6"
                            scaleOnHover={true}
                            ><span>Get Margins</span> <Icon name="arrowSmRight" /></Button
                        >
                    </li> -->
				</ul>
			</nav>
		</div>
	</Header>
	<main class="flex-1 px-2 pt-[--header-height]">
		<slot />
	</main>
</div>

<style>
	:root {
		--header-height: 64px;
	}
</style>
