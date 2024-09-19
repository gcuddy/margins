import { NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Logger, LogLevel } from "effect"
import { HttpLive } from "./Http.js"
import { TracingLive } from "./Tracing.js"

// NodeRuntime.runMain(Layer.launch(Layer.provide(app, HttpLive)))

HttpLive.pipe(Layer.provide(TracingLive), Layer.launch, NodeRuntime.runMain)
