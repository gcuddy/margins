<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import CardContent from "$lib/components/ui/card/CardContent.svelte";
	import CardFooter from "$lib/components/ui/card/CardFooter.svelte";
	import CardHeader from "$lib/components/ui/card/CardHeader.svelte";
	import Skeleton from "$lib/components/ui/skeleton/Skeleton.svelte";
</script>

<Card>
	<CardHeader class="gap-2">
		<Skeleton class="h-5 w-1/5" />
		<Skeleton class="h-4 w-4/5" />
	</CardHeader>
	<CardContent class="h-10" />
	<CardFooter>
		<Skeleton class="h-8 w-[120px] bg-gray-200" />
	</CardFooter>
</Card>
