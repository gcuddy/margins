import type { PrismaClient } from "@prisma/client";

function middleware(prisma: PrismaClient) {
    prisma.$use(async (params, next) => {
        // Check incoming query type
        if (typeof params.model === "string" && params.model === "Annotation") {
            if (params.action === "update") {
                // check if updating body or tag or target, if so, add editedAt
                const keys = Object.keys(params.args["data"])
                if (["body"].some(k => keys.includes(k))) {
                    params.args["data"]["editedAt"] = new Date()
                }
            }
        }
        return next(params);
    });
}

export default middleware;