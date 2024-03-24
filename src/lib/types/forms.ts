export type Message = {
	status: 'success' | 'error' | 'warning' | 'info';
	text: string;
	toast?: boolean;
};

export function createMessage(message: Message) {
	return message;
}
