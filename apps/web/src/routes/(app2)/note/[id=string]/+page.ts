import { writable } from 'svelte/store';

export async function load({params}) {
    const { id } = params;
    return {
        id,
    };
}
