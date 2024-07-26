import type { Command } from '@margins/features/commands';
import { locationCommands } from '@margins/features/entries';
import type { ReplicacheType } from '@margins/features/replicache';

export const createLocationCommands = (rep: ReplicacheType, id: string) =>
	locationCommands.map((command) => {
		return {
			action: () => {
				rep.mutate.bookmark_update({
					id,
					input: {
						status: command.id,
					},
				});
			},
			...command,
		};
	}) satisfies Command[];
