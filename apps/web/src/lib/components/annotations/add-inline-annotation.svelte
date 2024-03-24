<script lang="ts">
	import AnnotationForm from '$components/annotations/annotation-form.svelte';
	import { Button } from '$components/ui/button';
	import { TimestampInput } from '$components/ui/timestamp';

	import player from '$lib/stores/player';
	import { durationToSeconds, formatDuration } from '$lib/utils/date';

	type $$Props = ComponentProps<AnnotationForm>;

	export let target: $$Props['target'] = undefined;
	export let type: $$Props['type'] | undefined = undefined;

	import { Cross2, Crosshair1 } from 'radix-icons-svelte';
	import type { ComponentProps } from 'svelte';

	let _timestamp = '';
    $: console.log({ target, type, _timestamp });
</script>

<AnnotationForm
	autofocus
	on:cancel
	on:save
	target={target
		? target
		: _timestamp
		? {
				source: '',
				selector: {
					type: 'FragmentSelector',
					value: `t=${durationToSeconds(_timestamp)}`,
				},
		  }
		: undefined}
	type={type ? type : _timestamp ? 'annotation' : 'note'}
	{...$$restProps}
>
	<svelte:fragment slot="header">
		{#if $player}
			{@const player = $player.player}
			{@const time = player.getCurrentTime()}
			{#await time}
				...
			{:then timestamp}
				<TimestampInput
					on:update={(e) => {
                        console.log('update', e.detail);
						_timestamp = e.detail.duration;
					}}
					duration={formatDuration(
						Math.floor(Number(timestamp)),
						's',
						true,
						':',
					)}
					let:updateDuration
					let:currentTimestamp
					showReset={false}
				>
					<button
						on:click={async () => {
							const time = await player.getCurrentTime();
							updateDuration(formatDuration(Math.floor(time), 's', true, ':'));
						}}
					>
						{#if currentTimestamp}
							<Crosshair1 class="h-4 w-4 text-muted-foreground" />
							<span class="sr-only"> Set timestamp </span>
						{:else}
							<Button variant="ghost" size="sm">Set timestamp</Button>
						{/if}
					</button>
					{#if currentTimestamp}
						<button
							on:click={() => {
								updateDuration('');
							}}
						>
							<Cross2 class="h-4 w-4 text-muted-foreground" />
							<span class="sr-only"> Clear timestamp </span>
						</button>
					{/if}
				</TimestampInput>
			{/await}
		{/if}
	</svelte:fragment>
</AnnotationForm>
