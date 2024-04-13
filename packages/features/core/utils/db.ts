import type { DB } from '@margins/db';
import { Context } from '@margins/lib/server';

const DBContext = Context.create<DB>('DBContext');

export const useDB = DBContext.use;
export const withDB = DBContext.with;
