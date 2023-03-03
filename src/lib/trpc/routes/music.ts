import { z } from "zod";

import { spotify } from "$lib/features/services/spotify";

import { publicProcedure, router } from "../t";

export const musicRouter = router({
    public: router({
        search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
            const results = await spotify.searchAlbums(input);
        //    const items = results.body?.albums?.items.filter(item =>  item.album_type === "album")
        //    results.body.albums.items.filter(item => {
        //     item.album_type === 'album'
        //    })
            return results;
        }),
        album: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
            const results = await spotify.getAlbum(input);
            return results;
        }),
    }),
})
