import { dev } from '$app/environment';
import type { HandleClientError } from '@sveltejs/kit';
import { H } from 'highlight.run';

// !dev && H.init('0dq999eo', {
//     environment: dev ? 'development' : 'production',
//     version: 'commit:abcdefg12345',
//     networkRecording: {
//         enabled: true,
//         recordHeadersAndBody: true,
//         urlBlocklist: [
//             // insert urls you don't want to record here
//         ],
//     },
//     // tracingOrigins: {}
// });
export const handleError = (({ error, event }) => {

}) satisfies HandleClientError
