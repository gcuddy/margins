// taken largely from https://github.dev/sst/console/blob/dev/packages/functions/src/replicache/pull1.ts

import type { z, ZodSchema } from 'zod';
import type { WriteTransaction } from 'replicache';

interface Mutation<Name extends string = string, Input = any> {
	input: Input;
	name: Name;
}

export class Server<Mutations> {
	private mutations = new Map<
		string,
		{
			fn: (input: any) => Promise<void>;
			input: ZodSchema;
		}
	>();

	public mutation<
		Name extends string,
		Shape extends ZodSchema,
		Args = z.infer<Shape>,
	>(
		name: Name,
		shape: Shape,
		fn: (input: z.infer<Shape>) => Promise<any>,
	): Server<Mutations & { [key in Name]: Mutation<Name, Args> }> {
		this.mutations.set(name as string, {
			fn: async (args) => {
				const parsed = args;
				return fn(parsed);
			},
			input: shape,
		});
		return this;
	}

	public expose<
		Name extends string,
		Shape extends ZodSchema,
		Args = z.infer<Shape>,
	>(
		name: Name,
		fn: ((input: z.infer<ZodSchema>) => Promise<any>) & {
			schema: Shape;
		},
	): Server<Mutations & { [key in Name]: Mutation<Name, Args> }> {
		this.mutations.set(name as string, {
			fn,
			input: fn.schema,
		});
		return this;
	}

	public execute(name: string, args: unknown) {
		console.log('execute', name, args);
		const mut = this.mutations.get(name as string);
		if (!mut) throw new Error(`Mutation "${name}" not found`);
		return mut.fn(args);
	}

	public has(name: string) {
		return this.mutations.has(name);
	}
}

export type ExtractMutations<S extends Server<any>> =
	S extends Server<infer M> ? M : never;

export class Client<
	S extends Server<any>,
	Mutations extends Record<string, Mutation> = ExtractMutations<S>,
> {
	private mutations = new Map<string, (...input: any) => Promise<void>>();

	public mutation<Name extends keyof Mutations>(
		name: Name,
		fn: (
			tx: WriteTransaction,
			input: Mutations[Name]['input'],
		) => Promise<void>,
	) {
		this.mutations.set(name as string, fn);
		return this;
	}

	public build(): {
		[key in keyof Mutations]: (
			ctx: WriteTransaction,
			args: Mutations[key]['input'],
		) => Promise<void>;
	} {
		return Object.fromEntries(this.mutations.entries()) as any;
	}
}
