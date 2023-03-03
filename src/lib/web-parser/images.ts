import type { HTMLElement } from "node-html-parser";


export function cleanUpNaughtyUrl(url: string) {
    // remove everything after ? or #
    if (url.includes("wikia.nocookie.net")) {
        return url.replace(/\/revision\/latest\/scale-to-width-down\/\d+\?cb=\d+/, "");
    }
    // const cleanUrl = url.replace(/(\?|#).*/, "");
    // return cleanUrl;
    return url;
}

export function fixImages(node: HTMLElement) {
    const images = node.querySelectorAll("img");
    images.forEach((img) => {
        const src = img.getAttribute("src");
        if (!src) return;
        // fix wikia.nocookie.net images
        // https://static.wikia.nocookie.net/aesthetics/images/2/28/Chobani_Ad_2.png/revision/latest/scale-to-width-down/174?cb=20210311190843
        // should remove everything after .png
        img.setAttribute("src", cleanUpNaughtyUrl(src));
    });
    return node;
}
