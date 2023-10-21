import { createQueryOption, type QueryInit } from '$lib/queries/query';
import type { Status } from '$lib/status';

const query = (init: { [index: string]: unknown }) => {};

// want to be able to call createqueryoption<"get_library"> and it will return the correct type

export const libraryQuery = createQueryOption("get_library", "infinite");
