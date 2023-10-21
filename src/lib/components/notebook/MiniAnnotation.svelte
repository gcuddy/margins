<script lang="ts">
	import type { TargetSchema } from '$lib/annotation';
	import type { AnnotationsInEntry } from '$lib/db/selects';

	export let annotation: AnnotationsInEntry;


    const isTarget = (data: unknown): data is TargetSchema => !!data;


</script>

<div class="flex flex-col gap-1 rounded-lg border bg-card px-2 py-2 text-xs text-card-foreground">
	<div class="flex items-center gap-2">
		<span class="font-medium text-muted-foreground">
			{annotation.username}
		</span>
	</div>
    <div>
       {annotation.body || annotation} 
    </div>
</div>
