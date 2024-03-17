<script>
	import '$lib/styles/warbler.css';

	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex min-h-screen select-text flex-col">
	<header class="container z-40">
		<nav class=" mx-auto flex items-center justify-between space-x-4 p-4">
			<!-- <span class="logo text-4xl font-bold">Margins</span> -->
			<div />
			<ul class="flex items-center justify-end space-x-4 p-4">
				<li>
					<Button
						variant="ghost"
						href="/login"
						class="font-semibold hover:bg-transparent">Login</Button
					>
				</li>
				<li>
					<Button
						variant="secondary"
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
	</header>
	<main class="flex-1">
		<slot />
	</main>
</div>
