import { z } from "zod";

export const linksSchema = z.string().url().array();
