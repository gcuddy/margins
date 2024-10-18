import { crossfade } from 'svelte/transition';

/**
 * Creating the crossfade object in a separate javascript file
 * This ensures that there is a single instance of the crossfade
 * That allows you to connect element from diffent components and cro
 */
export const [send, receive] = crossfade({});
