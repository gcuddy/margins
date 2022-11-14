<script>
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
</script>

<div class="min-h-screen bg-amber-50 text-amber-900">
	<header class="sticky top-0">
		<nav>
			<ul class=" mx-auto flex items-center justify-end space-x-4 p-4">
				<li><a data-sveltekit-prefetch href="/login">Login</a></li>
				<li>
					<Button
						as="a"
						href="/signup"
						size="lg"
						className="flex font-bold items-center gap-1 py-6"
						scaleOnHover={true}><span>Get Margins</span> <Icon name="arrowSmRight" /></Button
					>
				</li>
			</ul>
		</nav>
	</header>
	<main>
		<slot />
	</main>
</div>
