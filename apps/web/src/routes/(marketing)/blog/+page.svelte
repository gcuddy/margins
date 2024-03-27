<script>
	export let data;
	$: console.log({ data });
</script>

<h1>Blog</h1>

{JSON.stringify(data)}
