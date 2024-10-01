import { EntryId } from '@margins/api2/src/Domain/Entry';

export const load = (e) => {
	return {
		id: EntryId.make(e.params.id)
	};
};
