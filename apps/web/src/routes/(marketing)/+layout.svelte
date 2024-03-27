<script>
	import '@fontsource/instrument-serif';
	import { Button, Logo } from '@margins/ui';
</script>

<div class="flex min-h-screen select-text flex-col">
	<header
		class="bg-glass/[.01] border-glass/10 fixed left-0 right-0 top-0 z-40 h-16 border-b backdrop-blur-md"
	>
		<div class="mx-auto h-full w-full max-w-5xl">
			<nav class="flex h-full w-full items-center justify-between space-x-4">
				<!-- <span class="logo text-4xl font-bold">Margins</span> -->
				<div class="flex items-center gap-2">
					<Logo class="h-4 w-4" />
					Margins
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
	</header>
	<main class="flex-1 px-2">
		<slot />
	</main>
</div>
