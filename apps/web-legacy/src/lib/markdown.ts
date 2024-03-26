import MarkdownIt from "markdown-it";
import mk from '@traptitech/markdown-it-katex';


export const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,

});

md.use(mk);