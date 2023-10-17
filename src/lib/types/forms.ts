export type Message = {
	status: 'success' | 'error' | 'warning' | 'info';
	text: string;
};

export function createMessage(message: Message) {
	return message;
}
