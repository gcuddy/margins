<script lang='ts'>
	import { page } from "$app/stores";


    export let image: string;

    $: src = $page.data.S3_BUCKET_PREFIX + image;
</script>

<img {src} />
