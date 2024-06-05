export const createEmptyVariants = <T extends string[]>(variants: T) => {
  return Object.fromEntries(variants.map(v => [v, ""])) as {
    [K in T[number]]: string
  }
}
