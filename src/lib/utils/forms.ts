export const post = async <TBody extends Record<string, string | number | boolean>>(action: string, body?: TBody) => {
    console.log({ action, body })
    const data = new FormData();
    Object.entries(body || {}).forEach(([key, value]) => {
        console.log({ key, value })
        if (key && value) data.append(key, value.toString());
    });
    console.log({ data })
    try {
        await fetch(action, {
            method: "POST",
            headers: {
                'x-sveltekit-action': 'true',
            },
            body: data
        })
    } catch (e) {
        console.error(e)
    }
}