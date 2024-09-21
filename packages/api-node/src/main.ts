import { NodeRuntime } from "@effect/platform-node"
import { Layer, Logger, LogLevel } from "effect"
import { HttpLive } from "./Http.js"
import { TracingLive } from "./Tracing.js"

// NodeRuntime.runMain(Layer.launch(Layer.provide(app, HttpLive)))

HttpLive.pipe(
  Layer.provide(TracingLive),
  Layer.launch,
  Logger.withMinimumLogLevel(LogLevel.Info),
  NodeRuntime.runMain,
)

// HttpApp.Live.pipe(Layer.provide(TracingLive), Layer.launch, NodeRuntime.runMain)
