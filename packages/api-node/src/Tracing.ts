import * as NodeSdk from "@effect/opentelemetry/WebSdk"
// @ts-expect-error - this is an error for me for some reason
import { OTLPExporter } from "@microlabs/otel-cf-workers"
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { Config, Effect, Layer, type Option, Redacted, Secret } from "effect"

// const GrafanaConfig = Config.all({
//   url: Config.string("OTLP_URL"),
//   auth: Config.option(Config.redacted("OTLP_AUTH")),
// })

export const TracingLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    // const { url, auth } = yield* GrafanaConfig
    // const headers = yield* makeHeaders(auth)
    const traceExporter = new OTLPExporter({
      url: "http://localhost:4318/v1/traces",
      // headers,
    })

    return NodeSdk.layer(() => ({
      resource: {
        serviceName: "margins.app",
      },
      // spanProcessor: new BatchSpanProcessor(traceExporter),
      spanProcessor: new BatchSpanProcessor(traceExporter),
    }))
  }),
)

function makeHeaders(auth: Option.Option<Redacted.Redacted>) {
  return auth.pipe(
    Effect.map(a => ({
      Authorization: Redacted.value(a),
    })),
    Effect.orElseSucceed(() => ({})),
  )
}
