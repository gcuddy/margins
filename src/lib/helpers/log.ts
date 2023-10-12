class Logger {
	public static log(...args: any[]) {
		console.log(...args);
	}
	public static warn(...args: any[]) {
		console.warn(...args);
	}
	public static error(...args: any[]) {
		console.error(...args);
	}

	public static label(label: string, ...args: any[]) {
		return Logger.log(label, ...args);
	}
}
