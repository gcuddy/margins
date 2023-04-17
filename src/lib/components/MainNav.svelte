<script>
	import { page } from "$app/stores";
	import { Flower } from "lucide-svelte";
	import Avatar from "./ui/Avatar.svelte";
</script>

<div class="flex grow gap-6 md:gap-10">
	<a class="hidden items-center space-x-2 md:flex" href="/">
		<Flower />
		<span class="hidden font-bold sm:inline-block">Margins</span>
	</a>
	<!-- logo -->
	{#if $page.data.user_data}
		<div class="ml-auto flex items-center space-x-2">
			<Avatar size="36px" name={$page.data.user_data.username} />
			<span>{$page.data.user_data.username}</span>
		</div>
	{/if}
	<!--  -->
</div>
