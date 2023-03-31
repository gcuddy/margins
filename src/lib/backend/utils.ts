export async function generateKeyFromUrl(url: string, ext?: string, path = "") {
    const u = new URL(url)
    u.search = "";
    const cleanedUrl = u.toString();
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(cleanedUrl));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    const Key = path + `${hashHex}${ext ? "." + ext : ""}`
    return Key;
}
