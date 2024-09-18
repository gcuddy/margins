import { Effect, Context, Console } from "effect"
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform"
import type { URL } from "./schema.js"
import { parseArticle } from "@margins/parser"

export class GetHTMLError {
  readonly _tag = "GetHTMLError"
}

// export const getHtml = (url: string) =>
// 	Effect.tryPromise({
// 		try: () => fetch(url).then((res) => res.text()),
// 		catch: () => new GetHTMLError(),
// 	});

// Next steps... parsing

type Element = {
  querySelector: (selector: string) => Element | null
  innerText?: string
  getAttribute: (name: string) => string | undefined
}

export class Parser extends Context.Tag("api/Parser")<
  Parser,
  {
    parse: (html: string) => Element
  }
>() {}

// TODO: fetch layer?
const get_html = (url: URL) =>
  HttpClientRequest.get(url).pipe(HttpClient.fetchOk, HttpClientResponse.text)

class ParseError {
  readonly _tag = "ParseError"
}

const parse = (url: URL) =>
  Effect.gen(function* () {
    const html = yield* get_html(url)
    yield* Console.log("html", html)
    const { parse } = yield* Parser
    const document = parse(html)
    // yield * Console.log("what is going on", document)
    // should queryselector stuff be some sort of context or effect
    const title =
      document
        .querySelector("meta[property='og:title']")
        ?.getAttribute("content") ??
      document.querySelector("title")?.innerText ??
      "no title"
    const image = document
      .querySelector("meta[property='og:image']")
      ?.getAttribute("content")
    const description = document
      .querySelector("meta[name='description']")
      ?.getAttribute("content")

    yield* Console.log("title", title)

    const article = yield* Effect.tryPromise({
      try: () =>
        parseArticle({
          url,
          html,
        }),
      catch: () => new ParseError(),
    })

    return { title, image, description, url } as const
  })

export { parse }
