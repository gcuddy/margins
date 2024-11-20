import { defineConfig } from "vitest/config"
import * as Path from "node:path"

export default defineConfig({
  test: {
    include: [Path.resolve(__dirname, "src/**/*.test.ts")],
  },
})
