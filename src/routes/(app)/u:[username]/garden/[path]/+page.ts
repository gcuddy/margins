import { get } from 'idb-keyval';

import { browser } from '$app/environment';
import { trpc } from '$lib/trpc/client';

import type { PageLoad } from './$types';

export const prerender = false;


async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
        options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    // // Request permission. If the user grants permission, return true.
    // if ((await fileHandle.requestPermission(options)) === 'granted') {
    //     return true;
    // }
    // The user didn't grant permission, so return false.
    return false;
}
export const load = (async (e) => {
    console.log("hello")
    if (browser) {
        console.log("browser")
        const directoryHandle = await get('directory');
        if (!directoryHandle) return {
            directory: null,
        };
        const permission = await verifyPermission(directoryHandle, false);
        if (!permission) {
            return {
                permission: false,
                directory: directoryHandle as FileSystemDirectoryHandle,
            }
        }
        const fileHandle = await directoryHandle.getFileHandle(e.params.path);
        console.log(fileHandle)
        const file = await fileHandle.getFile();
        console.log(file)
        const contents = await file.text();
        if (directoryHandle) {
            return {
                directory: directoryHandle as FileSystemDirectoryHandle,
                permission: true,
                contents,
                html: trpc(e).public.parseMarkdown.query({ markdown: contents })
            }
        }
    }
}) satisfies PageLoad;
