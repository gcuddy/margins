// modeled off https://github.com/pilcrowOnPaper/lucia/tree/main/packages/adapter-kysely/src
import type { Kysely, Selectable, ColumnType, Generated } from "kysely";
import type { Adapter, AdapterFunction, KeySchema, SessionSchema } from "lucia-auth";

type BigIntColumnType = ColumnType<bigint | number>;

export type KyselySession = {
    active_expires: BigIntColumnType;
    id: string;
    idle_expires: BigIntColumnType;
    user_id: string;
};

export type KyselyUser = {
    id: string;
};

export type KyselyKey = {
    id: string;
    hashed_password: string | null;
    user_id: string;
    primary_key: boolean | number;
    expires: BigIntColumnType | null;
};

export interface KyselyLuciaDatabase {
    auth_session: KyselySession;
    auth_user: KyselyUser;
    auth_key: KyselyKey;
}


type IsValidKyselySchema<KyselyDatabase> = KyselyDatabase extends {
    auth_user: any;
    auth_session: any;
}
    ? true
    : false;
// type IsValidKyselySchema<KyselyDatabase> = KyselyDatabase extends {
//     user: any;
//     session: any;
// }
//     ? KyselyDatabase["user"] extends KyselyUser
//     ? KyselyDatabase["session"] extends KyselySession
//     ? true
//     : false
//     : false
//     : false;

export const transformSessionData = (
    session: Selectable<KyselySession>
): SessionSchema => {
    return {
        id: session.id,
        user_id: session.user_id,
        active_expires: Number(session.active_expires),
        idle_expires: Number(session.idle_expires)
    };
};

export type Dialect = "pg" | "mysql2" | "better-sqlite3";

export const transformKeyData = (key: Selectable<KyselyKey>): KeySchema => {
    return {
        id: key.id,
        user_id: key.user_id,
        primary_key: Boolean(key.primary_key),
        hashed_password: key.hashed_password,
        expires: key.expires === null ? null : Number(key.expires)
    };
};

export const transformKeySchemaToKyselyExpectedValue = (
    key: KeySchema,
): Selectable<KyselyKey> => {
    return {
        id: key.id,
        user_id: key.user_id,
        primary_key: Number(key.primary_key),
        hashed_password: key.hashed_password,
        expires: key.expires
    };
};

const adapter = <DB extends Kysely<any>>(
    db: DB extends Kysely<infer KyselyDB> ?
        IsValidKyselySchema<KyselyDB> extends true ? DB : never : never
): AdapterFunction<Adapter> => (LuciaError) => {
    const kysely = db as Kysely<KyselyLuciaDatabase>;
    return {
        getUser: async (userId) => {
            console.log({ userId })
            console.time("getUser")
            console.log({ kysely })
            const data = await kysely
                .selectFrom("auth_user")
                .selectAll()
                .where("id", "=", userId)
                .executeTakeFirst();
            console.timeEnd("getUser");
            console.log({ data })
            return data ?? null;
        },
        getSessionAndUserBySessionId: async (sessionId) => {
            console.time("getSessionAndUserBySessionId")
            const data = await kysely
                .selectFrom("auth_session")
                .innerJoin("auth_user", "auth_user.id", "auth_session.user_id")
                .selectAll("auth_user")
                .select([
                    "auth_session.id as _session_id",
                    "auth_session.active_expires as _session_active_expires",
                    "auth_session.idle_expires as _session_idle_expires",
                    "auth_session.user_id as _session_user_id"
                ])
                .where("auth_session.id", "=", sessionId)
                .executeTakeFirst();
            if (!data) return null;
            const {
                _session_active_expires,
                _session_id,
                _session_idle_expires,
                _session_user_id,
                ...user
            } = data;
            console.timeEnd("getSessionAndUserBySessionId")
            return {
                user,
                session: transformSessionData({
                    id: _session_id,
                    user_id: _session_user_id,
                    active_expires: _session_active_expires,
                    idle_expires: _session_idle_expires
                })
            };
        },
        getSession: async (sessionId) => {
            console.time("getSession")
            const data = await kysely
                .selectFrom("auth_session")
                .select(["active_expires", "id", "idle_expires", "user_id"])
                .where("id", "=", sessionId)
                .executeTakeFirst();
            console.timeEnd("getSession")
            if (!data) return null;
            return transformSessionData(data);
        },
        getSessionsByUserId: async (userId) => {
            console.time("getSessionsByUserId")
            const result = await kysely
                .selectFrom("auth_session")
                .selectAll()
                .where("user_id", "=", userId)
                .execute();
            console.timeEnd("getSessionsByUserId")
            return result.map((val) => transformSessionData(val));
        },
        setUser: async (userId, attributes, key) => {
            try {
                const userResult = await kysely.transaction().execute(async (trx) => {
                    const result: Selectable<KyselyUser> | null = null;
                    await trx
                        .insertInto("auth_user")
                        .values({
                            id: userId,
                            ...attributes
                        })
                        .executeTakeFirstOrThrow();
                    if (key) {
                        await trx
                            .insertInto("auth_key")
                            .values(transformKeySchemaToKyselyExpectedValue(key))
                            .execute();
                    }
                    return result;
                });
                if (userResult) return userResult;
                const result = await kysely
                    .selectFrom("auth_user")
                    .selectAll()
                    .where("id", "=", userId)
                    .executeTakeFirst();
                if (!result) throw new LuciaError("AUTH_INVALID_USER_ID");
                return result;
            } catch (e) {
                console.error(e);
                // const error = e as Partial<MySQLError>;
                // if (
                //     error.code === "ER_DUP_ENTRY" &&
                //     error.message?.includes("PRIMARY")
                // ) {
                //     throw new LuciaError("AUTH_DUPLICATE_KEY_ID");
                // }
                throw e;
            }
        },
        deleteUser: async (userId) => {
            await kysely.deleteFrom("auth_user").where("id", "=", userId).execute();
        },
        setSession: async (session) => {
            try {
                await kysely.insertInto("auth_session").values(session).execute();
            } catch (e) {
                console.error(e);
                throw e;
            }
        },
        deleteSession: async (...sessionIds) => {
            await kysely
                .deleteFrom("auth_session")
                .where("id", "in", sessionIds)
                .execute();
        },
        deleteSessionsByUserId: async (userId) => {
            await kysely
                .deleteFrom("auth_session")
                .where("user_id", "=", userId)
                .execute();
        },
        updateUserAttributes: async (userId, attributes) => {
            if (Object.keys(attributes).length === 0) {
                const user = await kysely
                    .selectFrom("auth_user")
                    .where("id", "=", userId)
                    .selectAll()
                    .executeTakeFirst();
                if (!user) throw new LuciaError("AUTH_INVALID_USER_ID");
                return user;
            }
            await kysely
                .updateTable("auth_user")
                .set(attributes)
                .where("id", "=", userId)
                .executeTakeFirst();
            const user = await kysely
                .selectFrom("auth_user")
                .selectAll()
                .where("id", "=", userId)
                .executeTakeFirst();
            if (!user) throw new LuciaError("AUTH_INVALID_USER_ID");
            return user;
        },
        setKey: async (key) => {
            try {
                await kysely
                    .insertInto("auth_key")
                    .values(transformKeySchemaToKyselyExpectedValue(key))
                    .execute();
            } catch (e) {
                console.error(e)
                throw e;
            }
        },
        getKey: async (key, shouldDataBeDeleted) => {
            return await kysely.transaction().execute(async (trx) => {
                const data = await trx
                    .selectFrom("auth_key")
                    .selectAll()
                    .where("id", "=", key)
                    .executeTakeFirst();
                if (!data) return null;
                const transformedKeyData = transformKeyData(data);
                const dataShouldBeDeleted = await shouldDataBeDeleted(
                    transformedKeyData
                );
                if (dataShouldBeDeleted) {
                    await trx
                        .deleteFrom("auth_key")
                        .where("id", "=", data.id)
                        .executeTakeFirst();
                }
                return transformedKeyData;
            });
        },
        getKeysByUserId: async (userId) => {
            const data = await kysely
                .selectFrom("auth_key")
                .selectAll()
                .where("user_id", "=", userId)
                .execute();
            return data.map((val) => transformKeyData(val));
        },
        updateKeyPassword: async (key, hashedPassword) => {
            const data = await kysely
                .selectFrom("auth_key")
                .selectAll()
                .where("id", "=", key)
                .executeTakeFirst();
            if (!data) throw new LuciaError("AUTH_INVALID_KEY_ID");
            await kysely
                .updateTable("auth_key")
                .set({
                    hashed_password: hashedPassword
                })
                .where("id", "=", key)
                .executeTakeFirst();
            return;
        },
        deleteKeysByUserId: async (userId) => {
            await kysely.deleteFrom("auth_key").where("user_id", "=", userId).execute();
        },
        deleteNonPrimaryKey: async (key) => {
            await kysely
                .deleteFrom("auth_key")
                .where("id", "=", key)
                .where(
                    "primary_key",
                    "=",
                    false
                )
                .executeTakeFirst();
        }
    }
}

export default adapter;
