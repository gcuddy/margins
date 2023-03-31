import { Redis } from '@upstash/redis'
import { Client } from '@upstash/qstash';

import type {
    SessionSchema,
    SessionAdapter,
    AdapterFunction
} from "lucia-auth";
import { UPSTASH_QSTASH_TOKEN } from '$env/static/private';

export const redis = new Redis({
    url: 'https://us1-careful-gobbler-37650.upstash.io',
    token: 'AZMSASQgODZhNmYxZmEtZmQwZS00ZWFmLTlkOWMtMmViMzE4NWYzYThmNjNkNTc4MGMwNDAwNDYxNjhiMTViNThkMzVlZjQ4YmY=',
});
export const qstash = new Client({
    token: UPSTASH_QSTASH_TOKEN
});

export const redisSessionAdapter =
    (redisClient: {
        session: Redis;
        userSession: Redis;
    }): AdapterFunction<SessionAdapter> =>
        () => {
            const { session: sessionRedis, userSession: userSessionRedis } =
                redisClient;
            return {
                getSession: async (sessionId) => {
                    console.time("getSession")
                    const sessionData = await sessionRedis.get(sessionId);
                    if (!sessionData) return null;
                    console.timeEnd("getSession")
                    return sessionData as SessionSchema
                },
                getSessionsByUserId: async (userId) => {
                    const sessionIds = await userSessionRedis.lrange(userId, 0, -1);
                    const sessionData = await Promise.all(
                        sessionIds.map((id) => sessionRedis.get(id))
                    );
                    const sessions = sessionData.filter(Boolean)
                    console.log({ sessions })
                    return sessions as SessionSchema[];
                },
                setSession: async (session) => {
                    console.log(await Promise.all([
                        userSessionRedis.lpush(session.user_id, session.id),
                        sessionRedis.set(session.id, session, {
                            ex: Math.floor(Number(session.idle_expires) / 1000)
                        })
                    ]));
                },
                deleteSession: async (...sessionIds) => {
                    const targetSessionData = await Promise.all(
                        sessionIds.map((id) => sessionRedis.get(id))
                    );
                    const sessions = targetSessionData.filter(Boolean) as SessionSchema[];
                    console.log({ sessions })
                    await Promise.all([
                        ...sessionIds.map((id) => sessionRedis.del(id)),
                        ...sessions.map((session) =>
                            userSessionRedis.lrem(session.user_id, 1, session.id)
                        )
                    ]);
                },
                deleteSessionsByUserId: async (userId) => {
                    const sessionIds = await userSessionRedis.lrange(userId, 0, -1);
                    await Promise.all([
                        ...sessionIds.map((id) => sessionRedis.del(id)),
                        userSessionRedis.del(userId)
                    ]);
                }
            };
        };
