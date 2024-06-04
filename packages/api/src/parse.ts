import { Effect, Context } from "effect"
import * as Http from "@effect/platform/HttpClient"
import type { URL } from "./schema"

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
}

export class Parser extends Context.Tag("api/Parser")<
  Parser,
  {
    parse: (html: string) => Element
  }
>() {}

// TODO: fetch layer?
const get_html = (url: URL) =>
  Http.request.get(url).pipe(Http.client.fetchOk, Http.response.text)

const parse = (url: URL) =>
  Effect.gen(function* () {
    const html = yield* get_html(url)
    const { parse } = yield* Parser
    const parsed = parse(html)
    // should queryselector stuff be some sort of context or effect
    const title =
      parsed.querySelector("meta[property='og:title']")?.innerText ?? "no title"
    const image = parsed.querySelector("meta[property='og:image']")?.innerText
    const description = parsed.querySelector(
      "meta[name='description']",
    )?.innerText
    return { title, image, description, url } as const
  })

export { parse }
