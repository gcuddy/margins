<script lang="ts">
	const apiHeaderTime = Math.floor(Date.now() / 1000); //console.log(`apiHeaderTime=[${apiHeaderTime}]`);
	const sha1Algorithm = "sha1";
	const sha1Hash = crypto.createHash(sha1Algorithm);
	var data4Hash = apiKey + apiSecret + apiHeaderTime;
</script>
