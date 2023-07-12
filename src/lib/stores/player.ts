import type { audioPlayer } from "$components/AudioPlayer.svelte";
import { writable } from "svelte/store";
import type { YouTubePlayer } from 'youtube-player/dist/types';

type AudioPlayer = {
    type: "audio";
    player: typeof audioPlayer;
    timestamp: number;
}

type YoutubePlayer = {
    type: "youtube";
    player: YouTubePlayer;
    timestamp: number;
}


export type Player = AudioPlayer | YoutubePlayer | null;

const player = writable<Player>(null);

export default player;