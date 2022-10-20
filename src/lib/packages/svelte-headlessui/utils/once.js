export function once(cb) {
    let state = { called: false };
    return (...args) => {
        if (state.called)
            return;
        state.called = true;
        return cb(...args);
    };
}
