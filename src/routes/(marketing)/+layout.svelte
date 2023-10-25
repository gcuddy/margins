<script>
	import { Button } from '$lib/components/ui/button';
	import "$lib/styles/warbler.css";
</script>

<div class="flex min-h-screen select-text flex-col">
	<header class="container z-40">
		<nav class="flex items-center justify-between p-4">
            <div class="grow flex items-center gap-4">
                <a class="font-extrabold tracking-tight" href="/">
                Margins
                </a>
                <ul class="flex text-sm text-muted-foreground">
                    <li>
                        <a class="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60" href="/docs">Docs</a>
                    </li>
                </ul>
            </div>
			<ul class=" mx-auto flex items-center justify-end space-x-4">
				<li><Button variant="secondary" href="/login">Login</Button></li>
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
	</header>
	<main class="flex-1">
		<slot />
	</main>
</div>
