import type { CustomExtractor } from '../../index'

export const nprorg: CustomExtractor = {
    domain: ['npr.org', 'www.npr.org'],
    enclosureUrl: [['.audio-module-controls-wrap', 'data-audio', 'audioUrl']],
    duration: [['.audio-module-controls-wrap', 'data-audio', 'duration']],
    // type: (doc) => {
    //     if (doc.querySelector(".audio-module-controls-wrap")) {
    //         return "audio";
    //     } else {
    //         return "article";
    //     }
    // }
    type: [['.audio-module-controls-wrap', 'audio'], "article"],
};
