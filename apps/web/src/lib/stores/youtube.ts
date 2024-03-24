import { derived } from 'svelte/store';
import player from './player';

export const currentYoutubeTime = derived(
	player,
	($player, set) => {
		let interval: ReturnType<typeof setInterval>;
		if ($player?.type === 'youtube') {
			interval = setInterval(() => {
				$player.player.getCurrentTime().then((time) => set(time));
			}, 1000);
		}
		return () => {
			clearInterval(interval);
		};
	},
	null as number | null,
);
