/**
 * Like Object.keys, but unsound in exchange for more convenience.
 *
 * Casts the result of Object.keys to the known keys of an object type,
 * even though JavaScript objects may contain additional keys.
 *
 * Only use this function when you know/control the provenance of the object
 * you're iterating, and can verify it contains exactly the keys declared
 * to the type system.
 *
 * Example:
 * ```
 * const o = {x: "ok", y: 10}
 * o["z"] = "UNTRACKED_KEY"
 * const safeKeys = Object.keys(o)
 * const unsafeKeys = objectKeys(o)
 * ```
 * => const safeKeys: string[]
 * => const unsafeKeys: ("x" | "y")[] // Missing "z"
 */
export const objectKeys = Object.keys as <T>(obj: T) => Array<keyof T>;
