import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
	name: 'flashcard',

	group: 'block',

	content: 'inline*',

	addAttributes() {
		return {
			prompt: {
				default: ''
			},
			response: {
				default: ''
			}
		};
	},
	parseHTML() {
		return [
			{
				tag: 'margins-flashcard'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ['margins-flashcard', mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return ({ editor, node, getPos }) => {
			// Markup
			/*
        <div class="margins-flashcard">
         <span class="margins-flashcard-prompt" contenteditable>Prompt</span>
         <span class="arrow" contenteditable="false" />
            <span class="margins-flashcard-response" contenteditable>Response</span>
        </div>
      */

			const dom = document.createElement('div');

			dom.classList.add('node-view');

			const label = document.createElement('span');

			label.classList.add('label');
			label.innerHTML = 'Node view';
			label.contentEditable = 'false';

			const content = document.createElement('div');

			content.classList.add('content');

			const prompt = document.createElement('span');
			prompt.classList.add('margins-flashcard-prompt');

			const arrow = document.createElement('span');
			arrow.classList.add('arrow');
			arrow.contentEditable = 'false';

			const response = document.createElement('span');
			response.classList.add('margins-flashcard-response');

			dom.append(label, content);

			return {
				dom,
				contentDOM: content
			};
		};
	}
});
