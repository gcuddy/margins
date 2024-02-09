<script>
	import { Button } from '$lib/components/ui/button';
	import '$lib/styles/warbler.css';
	import './roslindale.css';
</script>

<div
	class="flex min-h-screen select-text flex-col bg-gradient-to-b from-amber-900 to-amber-950 text-white"
>
	<header class="container z-40">
		<nav class=" mx-auto flex items-center justify-between space-x-4 p-4">
			<span class="logo text-4xl font-bold">Margins</span>
			<ul class=" mx-auto flex items-center justify-end space-x-4 p-4">
				<li>
					<Button
						variant="ghost"
						href="/login"
						class="font-semibold uppercase hover:bg-white/25 hover:text-white"
						>Login</Button
					>
				</li>
				<li>
					<Button
						variant="secondary"
						href="/signup"
						class="font-semibold uppercase">Sign up</Button
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

<style>
	.logo {
		font-family: 'Roslindale';
	}
</style>
