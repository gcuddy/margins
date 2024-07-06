/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    namespace Superforms {
      type Message = import("$lib/types/forms").Message
    }

    interface Locals {
      auth: import("lucia").Lucia
      db: import("@margins/db").DB
      session: import("lucia").Session | null
      user: import("lucia").User | null
    }
    interface PageData {
      description?: string
      title?: string

      user?: import("lucia").User
    }
  }
}

export {}
