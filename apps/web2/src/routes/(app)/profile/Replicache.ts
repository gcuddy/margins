import { Context } from 'effect';
import * as R from 'replicache';

// TODO: mutators
// TODO: live
export class Replicache extends Context.Tag('Replicache')<Replicache, R.Replicache>() {}
