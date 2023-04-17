<script>
	import {
		Tabs,
		TabsList,
		TabsTrigger,
		TabsContent,
	} from "$lib/components/ui/tabs/";
	import { H1, H2 } from "$lib/components/ui/typography";

	export let data;
</script>

<H1>{data.person}</H1>

<H2>Your Bookmarks</H2>
{JSON.stringify(data.entries)}
