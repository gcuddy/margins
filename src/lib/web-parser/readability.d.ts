  export class Readability<T = string> {
    constructor(
      document: Document,
      options?: {
        debug?: boolean;
        maxElemsToParse?: number;
        nbTopCandidates?: number;
        charThreshold?: number;
        classesToPreserve?: string[];
        keepClasses?: boolean;
        serializer?: (node: Node) => T;
        disableJSONLD?: boolean;
      },
      baseUrl?: string
    );

    parse(): null | {
      /** article title */
      title: string;

      /** HTML string of processed article content */
      content: T;

      /** text content of the article, with all the HTML tags removed */
      textContent: string;

      /** length of an article, in characters */
      length: number;

      /** article description, or short excerpt from the content */
      excerpt: string;

      /** author metadata */
      byline: string;

      /** content direction */
      dir: string;

      /** name of the site */
      siteName: string;

      /** content language */
      lang: string;
    };
  }
