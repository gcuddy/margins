/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Effect, Schema } from "effect";
import { Record } from "effect";

import type * as ReplicacheApiGroup from "./ReplicacheApiGroup.js"

export const TypeId: unique symbol = Symbol.for("@margins/replicache/Api")

export type TypeId = typeof TypeId

