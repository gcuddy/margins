import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    runtime: "nodejs18.x",
}
export const load: LayoutLoad = async () => {
    console.log('running layout load for /rss');
};
