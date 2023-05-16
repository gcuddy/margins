<script>
	import Scroller from '$lib/components/Scroller.svelte';
	export let data;
</script>
<div class="h-screen w-screen">
<Scroller
	items={data.posts}
	on:more={() => {
		console.log('more');
	}}
>
	<div slot="header" class="mx-auto max-w-2xl px-4">
		<slot name="header" />
	</div>

	<div slot="item" class="mx-auto max-w-2xl px-4" let:item let:i>
		<div class="my-8">
			<a
				href="/{item.title}/{item.id}"
				class="block"
				style="transform: rotate({0.5 + 1 * (i % 2 ? -1 : 1)}deg)"
				on:click={async (e) => {
					if (e.metaKey || innerWidth < 640) return;

					e.preventDefault();

					const { href } = e.currentTarget;

				}}
			>
				<h2 class="text-2xl font-semibold">{item.title}</h2>
			</a>

			<span>{item.body.slice(0,100)}</span>
		</div>
	</div>

	<div slot="empty">
		<slot name="empty" />
	</div>

	<div slot="footer" class="mx-auto mb-8 max-w-2xl px-4 text-right">
		<!-- {#if next}
			<a class="text-pink-600" href="{$page.url.pathname}?start={next}">next page</a>
		{/if} -->
	</div>
</Scroller>
</div>