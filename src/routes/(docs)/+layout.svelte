<script>
	import { ChevronRight } from "radix-icons-svelte";

</script>

<main class="flex">
	<!-- TODO: obviously automate this -->
	<aside class="w-72 p-8 flex flex-col gap-8">
		<div class="flex items-center gap-1 ">
            <h1 class="font-extrabold tracking-tight"><a href="/">Margins</a></h1>
            <ChevronRight class="w-4 h-4" />
            <span class="text-stone-500 tracking-tight"><a href="/docs">Docs</a></span>
        </div>
		<!-- TODO Icon here -->
		<nav>
			<ul>
				<li>
					<a class="h-8 px-2 w-full items-center rounded-md text-sm font-medium leading-none flex hover:bg-secondary" href="/docs/saving-content">
						<span>Saving Content</span>
					</a>
				</li>
			</ul>
		</nav>
	</aside>
	<div class="flex flex-col gap-8 p-8">
		<slot />
	</div>
</main>
