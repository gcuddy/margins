import { z } from 'zod';
const TimestampSelectorSchema = z.object({
    // source: z.string()   ,
    // selector: z.object({
    type: z.literal("FragmentSelector").default("FragmentSelector"),
    conformsTo: z.literal("http://www.w3.org/TR/media-frags/").default("http://www.w3.org/TR/media-frags/"),
    /**  e.g. "t=10,20" */
    value: z.string(),
    // }),
    // html: z.string().optional(),
});

export const TextQuoteSelectorSchema = z.object({
    type: z.literal('TextQuoteSelector'),
    exact: z.string(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
});

export const XPathSelectorSchema = z.object({
    type: z.literal('XPathSelector'),
    value: z.string(),
});

// TODO: this is not really complete but it works for now
export const RangeSelectorSchema = z.object({
    type: z.literal('RangeSelector'),
    startSelector: z.union([TextQuoteSelectorSchema, XPathSelectorSchema]),
    endSelector: z.union([TextQuoteSelectorSchema, XPathSelectorSchema]),
});

export const SelectorSchema = z.union([
    XPathSelectorSchema,
    TextQuoteSelectorSchema,
    RangeSelectorSchema,
    TimestampSelectorSchema
]);
export type Selector = z.infer<typeof SelectorSchema>;

export const TargetSchema = z.object({
    source: z.string(),
    selector: SelectorSchema,
    html: z.string().optional(),
});

export type TargetSchema = z.infer<typeof TargetSchema>;

export const annotationSchema = z.object({
    type: z.literal('annotation').default("annotation"),
    body: z.string(),
    id: z.string().optional(),
    userId: z.string(),
    private: z.boolean().optional(),
    target: TargetSchema,
    entryId: z.number().optional(),
    // tags: z.string().array(),
    // entry: z
    //     .object({
    //         connect: z.object({
    //             id: z.number().optional(),
    //             uri: z.string().optional(),
    //         }),
    //     })
    //     .optional(),
});

export type Annotation = z.infer<typeof annotationSchema>;
export type AnnotationSchema = typeof annotationSchema;