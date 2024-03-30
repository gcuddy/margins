import type { User } from 'lucia';
import { Context } from '@margins/lib/server';

const UserContext = Context.create<User>('user');
export const useUser = UserContext.use;
export const withUser = UserContext.with;
