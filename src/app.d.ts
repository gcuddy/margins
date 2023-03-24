/// <reference types="lucia-auth" />
declare namespace Lucia {
    type Auth = import("$lib/server/lucia.js").Auth;
    type UserAttributes = Partial<import("@prisma/client").User>
}

/// <reference types="@sveltejs/kit" />
declare namespace App {
    interface Locals {
        validate: import("@lucia-auth/sveltekit").Validate;
        validateUser: import("@lucia-auth/sveltekit").ValidateUser;
        setSession: import("@lucia-auth/sveltekit").SetSession;
    }
    interface PageData {
        // user?: import('$lib/user').RootUserData;
        user?: import("$lib/trpc/router").RouterOutputs["user"]["getUser"] & {
            stateIdToLocation: Map<number, import("@prisma/client").Location>;
            stateIdToName: Map<number, string>;
            states: import("$lib/trpc/router").RouterOutputs["user"]["getStates"];
        };
        currentList?: import("$lib/stores/currentList").CurrentList;
        // tags?: import("@prisma/client").Tag[];
        // subscriptions?: import("$lib/trpc/router").RouterOutputs["user"]["data"]["subscriptions"];
        // states?: import("@prisma/client").State[];
        filterMap?: import("$lib/stores/filter").FilterMapStore;
        queryClient: import("@tanstack/svelte-query").QueryClient;
        favorites?: import("$lib/trpc/router").RouterOutputs["favorites"]["list"];
        location?: import("@prisma/client").Location
        S3_BUCKET_PREFIX: string;
    }
}

declare type Item = import("svelte-dnd-action").Item;
declare type DndEvent<ItemType = Item> = import("svelte-dnd-action").DndEvent<ItemType>;
declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        onconsider?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
        onfinalize?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
    }
}
