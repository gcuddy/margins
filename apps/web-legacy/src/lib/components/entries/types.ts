export const views = ["List", "Grid", "Kanban"] as const;
export type View = typeof views[number];
