<script>
	import Button from "$lib/components/ui/Button.svelte";
	import "$lib/styles/warbler.css";
</script>

<div class="flex min-h-screen select-text flex-col">
	<header class="container sticky top-0 z-40">
		<nav>
			<ul class=" mx-auto flex items-center justify-end space-x-4 p-4">
				<li><Button as="a" href="/login">Login</Button></li>
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
