<script lang="ts">
	import GoogleBook from "./google-book.svelte";

    let { data } = $props();

  
</script>

<GoogleBook id={data.id} />