import { Context, Layer } from 'effect';
import * as R from 'replicache';

// TODO: mutators
// TODO: live
export class Replicache extends Context.Tag('Replicache')<Replicache, R.Replicache>() {
	static Live = (replicache: R.Replicache) => Layer.succeed(Replicache, replicache);
}
