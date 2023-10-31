export type Message = {
	status: 'success' | 'error' | 'warning' | 'info';
	text: string;
	toast?: boolean;
	stuff?: {};
};

export function createMessage(message: Message) {
	return message;
}
