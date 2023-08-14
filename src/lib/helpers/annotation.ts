import type { Annotation } from '@prisma/client';
import { nanoid } from 'nanoid/non-secure';

function makeAnnotation(annotation: Partial<Annotation>): Annotation {
	return {
		id: nanoid(),
		type: 'annotation',
		createdAt: new Date(),
		updatedAt: new Date(),
        body: null,
        bookmarkId: null,
        chosenIcon: null,
        color: "Yellow",
        contentData: null,
        deleted: null,
        due_timestamp: null,
        editedAt: null,
        entryId: null,
        exact: null,
        html: null,
        interval_ms: null,
        last_reviewed_at: null,
        parentId: null,
        private: false,
        quote: null,
        response: null,
        // sortOrder
		...annotation
	};
}

