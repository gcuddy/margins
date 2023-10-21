import type { PageData } from './$types';


// Utility type to get non-nullable versions
export type RequirePageData<T extends keyof PageData> = PageData & {
    [K in T]-?: NonNullable<PageData[K]>;
} 