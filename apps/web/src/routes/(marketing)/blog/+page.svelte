<script lang="ts">
	export let data;

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);

		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	}
</script>

<header>
	<div class="">
		<h1 class="text-2xl font-bold tracking-tight">Blog</h1>
	</div>
</header>

<div class="pt-8">
	<ul>
		{#each data.posts as post}
			<li class="">
				<a
					href="/blog/{post.slug}"
					class="before:bg-secondary relative flex items-center justify-between gap-2 py-4 before:pointer-events-none before:absolute before:-inset-x-2 before:-inset-y-2 before:-z-10 before:rounded-xl before:opacity-0 hover:before:opacity-100"
				>
					<span class="text-balance font-medium tracking-tight"
						>{post.title}</span
					>
					<span class="text-muted-foreground text-sm">
						{formatDate(post.date)}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</div>
