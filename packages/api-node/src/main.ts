import { NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { HttpLive } from "./Http.js"
import { TracingLive } from "./Tracing.js"

// NodeRuntime.runMain(Layer.launch(Layer.provide(app, HttpLive)))

HttpLive.pipe(Layer.provide(TracingLive), Layer.launch, NodeRuntime.runMain)

// HttpApp.Live.pipe(Layer.provide(TracingLive), Layer.launch, NodeRuntime.runMain)
