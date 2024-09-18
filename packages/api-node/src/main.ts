import { NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { app, HttpLive } from "./Http.js"

NodeRuntime.runMain(Layer.launch(Layer.provide(app, HttpLive)))
