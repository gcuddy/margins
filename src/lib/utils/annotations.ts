import type { Selector, TargetSchema } from "$lib/annotation";
import type { AnnotationsInEntry } from "$lib/db/selects";
import type { Entry } from "@prisma/client";

/**
 * Encode text for use in a URL fragment. Includes encoding for dashes, ampersands, and commas.
 * @see {@link https://wicg.github.io/scroll-to-text-fragment/#syntax}
 * @param str text to encode
 */
function encodeText(str: string) {
    return encodeURIComponent(str).replace(/[-&,]/g, (match) => `%${match.charCodeAt(0).toString(16)}`);
}


export function generateTextFragmentLink(baseUrl: string, annotation: {
    exact: string,
    prefix?: string,
    suffix?: string,
}) {
    const { exact, prefix, suffix } = annotation;

    const split = exact.split(" ")
    if (split.length >= 50) {
        // split into beginning few words and end few words
        const start = split.slice(0, 5).join(" ")
        const end = split.slice(split.length - 5).join(" ")
        return `${baseUrl}#:~:text=${encodeText(start)},${encodeText(end)}`;
    }

    // if there's no prefix, or suffix, have to use exact
    if ((!prefix && !suffix) || exact.split(" ").length) {
        return `${baseUrl}#:~:text=${encodeText(exact.split(" ").join(" "))}`;
    }

    // otherwise, we'll use the prefix and suffix
    if (typeof prefix === "string" && typeof suffix === "string") {
        return `${baseUrl}#:~:text=${encodeText(prefix)}-,${encodeText(exact.split(" ").slice(0, 5).join(" "))},-${encodeText(suffix)}`;
    }

}


export function getTargetSelector<TType extends Selector["type"]>(_target: unknown | TargetSchema, type: TType): Extract<Selector, { type: TType }> | undefined {
    const target = _target as TargetSchema;
    if (Array.isArray(target.selector)) {
        if (type === "TextQuoteSelector") {
            return target.selector[0] as Extract<Selector, { type: TType }> | undefined;
        }
        return target.selector.find((s) => s.type === type) as Extract<Selector, { type: TType }> | undefined;
    }
    if (target.selector.type === type) {
        return target.selector as Extract<Selector, { type: TType }>;
    }
}


export function triggerDownload({ title, author, uri }: Pick<Entry, 'title' | 'author' | 'uri'>, annotations: AnnotationsInEntry[]) {
    // write annotations to md file
    let header = '';
    if (title) {
        header += `# ${title}\n`
    }
    if (author) {
        header += `by ${author}\n`
    }
    if (uri) {
        header += `<${uri}>\n\n`
    }
    const md = annotations.map((a) => {
        const quote = getTargetSelector(a.target as TargetSchema, "TextQuoteSelector");
        let text = '';
        if (quote) {
            text = `> ${quote.exact}\n`
        }
        if (a.body) {
            text += `\n${a.body}\n`
        }
        return text;
    }).join("\n---\n\n")
    const blob = new Blob([header, md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title ?? 'annotations'}${author ? ' - ' + author : ''}.md`;
    a.click();
    URL.revokeObjectURL(url);
}