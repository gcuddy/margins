export function suppressConsoleLogs(cb, type = "error") {
    return (...args) => {
        let spy = jest.spyOn(global.console, type).mockImplementation(jest.fn());
        return new Promise((resolve, reject) => {
            Promise.resolve(cb(...args)).then(resolve, reject);
        }).finally(() => spy.mockRestore());
    };
}
