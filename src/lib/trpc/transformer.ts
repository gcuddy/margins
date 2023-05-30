import { parse, stringify } from 'devalue';

export const transformer = {
    serialize: (object: unknown) => stringify(object),
    deserialize: (object: string) => parse(object),
};
